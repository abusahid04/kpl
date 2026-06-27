<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

try {
    // Generate UUID function
    function gen_uuid() {
        return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
            mt_rand( 0, 0xffff ),
            mt_rand( 0, 0x0fff ) | 0x4000,
            mt_rand( 0, 0x3fff ) | 0x8000,
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
        );
    }

    $registerType = $_POST['register_type'] ?? 'player';
    $paymentId = $_POST['paymentId'] ?? null;

    $uploadDir = '../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    if ($registerType === 'team') {
        // ─── TEAM REGISTRATION SUBMISSION ───
        $stmt = $pdo->prepare("SELECT `value` FROM settings WHERE `key` = ?");
        $stmt->execute(['team_form_schema']);
        $schemaRaw = $stmt->fetchColumn();
        $schema = [];
        if ($schemaRaw) {
            $schema = json_decode($schemaRaw, true);
        }
        if (empty($schema)) {
            $schema = [
                ["id" => "name", "label" => "Franchise/Team Name", "type" => "text", "required" => true],
                ["id" => "ownerName", "label" => "Owner Name", "type" => "text", "required" => true],
                ["id" => "ownerMobile", "label" => "Owner Contact Number", "type" => "tel", "required" => true],
                ["id" => "description", "label" => "Team Description", "type" => "textarea", "required" => false],
                ["id" => "logo", "label" => "Team Logo", "type" => "file", "required" => false]
            ];
        }

        $formData = [];
        $uploadedFiles = [];

        foreach ($schema as $field) {
            $fid = $field['id'];
            $required = isset($field['required']) && $field['required'];
            $type = $field['type'] ?? 'text';

            if ($type === 'file') {
                if (isset($_FILES[$fid]) && $_FILES[$fid]['error'] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($_FILES[$fid]['name'], PATHINFO_EXTENSION);
                    $fileName = $fid . '_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                    if (move_uploaded_file($_FILES[$fid]['tmp_name'], $uploadDir . $fileName)) {
                        $uploadedFiles[$fid] = '/kpl/backend/uploads/' . $fileName;
                    } else {
                        throw new Exception("Failed to upload file for " . $field['label']);
                    }
                } elseif ($required) {
                    http_response_code(400);
                    echo json_encode(["error" => "Required file field is missing: " . $field['label']]);
                    exit;
                }
            } elseif ($type === 'checkbox') {
                $val = $_POST[$fid] ?? 'false';
                $formData[$fid] = ($val === 'true' || $val === '1' || $val === 'on');
            } else {
                $val = trim($_POST[$fid] ?? '');
                if ($required && $val === '') {
                    http_response_code(400);
                    echo json_encode(["error" => "Required field is missing: " . $field['label']]);
                    exit;
                }
                if ($type === 'tel' && $val !== '' && !preg_match('/^[0-9]{10}$/', preg_replace('/\D/', '', $val))) {
                    http_response_code(400);
                    echo json_encode(["error" => "Invalid 10-digit mobile number for: " . $field['label']]);
                    exit;
                }
                $formData[$fid] = $val;
            }
        }

        $id = gen_uuid();
        $name = $formData['name'] ?? '';
        $ownerName = $formData['ownerName'] ?? '';
        $description = $formData['description'] ?? '';
        $logoUrl = $uploadedFiles['logo'] ?? '';

        // Collect custom properties for team
        $additional = [];
        $standardKeys = ['name', 'ownerName', 'ownerMobile', 'description', 'logo'];
        foreach ($schema as $field) {
            $fid = $field['id'];
            if (!in_array($fid, $standardKeys)) {
                if ($field['type'] === 'file') {
                    $additional[$field['label']] = $uploadedFiles[$fid] ?? '';
                } else {
                    $additional[$field['label']] = $formData[$fid] ?? '';
                }
            }
        }
        // Also add ownerMobile into additional fields if it isn't standard in DB schema
        if (isset($formData['ownerMobile'])) {
            $additional['Owner Contact Number'] = $formData['ownerMobile'];
        }

        $additionalJson = !empty($additional) ? json_encode($additional) : null;

        $stmt = $pdo->prepare("INSERT INTO teams (id, name, ownerName, description, logoUrl, status, paymentId, additional_fields) VALUES (?, ?, ?, ?, ?, 'PENDING', ?, ?)");
        $stmt->execute([
            $id, $name, $ownerName, $description, $logoUrl, $paymentId, $additionalJson
        ]);

        echo json_encode(["success" => true, "message" => "Team registration submitted successfully", "id" => $id]);

    } else {
        // ─── PLAYER REGISTRATION SUBMISSION ───
        $stmt = $pdo->prepare("SELECT `value` FROM settings WHERE `key` = ?");
        $stmt->execute(['player_form_schema']);
        $schemaRaw = $stmt->fetchColumn();
        $schema = [];
        if ($schemaRaw) {
            $schema = json_decode($schemaRaw, true);
        }
        if (empty($schema)) {
            $schema = [
                ["id" => "name", "label" => "Player Full Name", "type" => "text", "required" => true],
                ["id" => "fatherName", "label" => "Father's Name", "type" => "text", "required" => true],
                ["id" => "mobile", "label" => "Mobile Number", "type" => "tel", "required" => true],
                ["id" => "email", "label" => "Email", "type" => "email", "required" => false],
                ["id" => "dob", "label" => "Date of Birth", "type" => "date", "required" => true],
                ["id" => "playingRole", "label" => "Playing Role", "type" => "select", "required" => true],
                ["id" => "battingStyle", "label" => "Batting Style", "type" => "select", "required" => false],
                ["id" => "bowlingStyle", "label" => "Bowling Style", "type" => "text", "required" => false],
                ["id" => "address", "label" => "Present Address", "type" => "textarea", "required" => true],
                ["id" => "isWicketKeeper", "label" => "Wicket Keeper", "type" => "checkbox", "required" => false],
                ["id" => "photo", "label" => "Passport Size Photo", "type" => "file", "required" => true],
                ["id" => "document", "label" => "Aadhar / Document", "type" => "file", "required" => true]
            ];
        }

        $formData = [];
        $uploadedFiles = [];

        foreach ($schema as $field) {
            $fid = $field['id'];
            $required = isset($field['required']) && $field['required'];
            $type = $field['type'] ?? 'text';

            if ($type === 'file') {
                if (isset($_FILES[$fid]) && $_FILES[$fid]['error'] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($_FILES[$fid]['name'], PATHINFO_EXTENSION);
                    $fileName = $fid . '_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                    if (move_uploaded_file($_FILES[$fid]['tmp_name'], $uploadDir . $fileName)) {
                        $uploadedFiles[$fid] = '/kpl/backend/uploads/' . $fileName;
                    } else {
                        throw new Exception("Failed to upload file for " . $field['label']);
                    }
                } elseif ($required) {
                    http_response_code(400);
                    echo json_encode(["error" => "Required file field is missing: " . $field['label']]);
                    exit;
                }
            } elseif ($type === 'checkbox') {
                $val = $_POST[$fid] ?? 'false';
                $formData[$fid] = ($val === 'true' || $val === '1' || $val === 'on');
            } else {
                $val = trim($_POST[$fid] ?? '');
                if ($required && $val === '') {
                    http_response_code(400);
                    echo json_encode(["error" => "Required field is missing: " . $field['label']]);
                    exit;
                }
                if ($type === 'tel' && $val !== '' && !preg_match('/^[0-9]{10}$/', preg_replace('/\D/', '', $val))) {
                    http_response_code(400);
                    echo json_encode(["error" => "Invalid 10-digit mobile number for: " . $field['label']]);
                    exit;
                }
                $formData[$fid] = $val;
            }
        }

        $id = gen_uuid();
        $name = $formData['name'] ?? '';
        $fatherName = $formData['fatherName'] ?? '';
        $email = $formData['email'] ?? '';
        $mobile = $formData['mobile'] ?? '';
        $address = $formData['address'] ?? '';
        $dob = $formData['dob'] ?? '';
        $playingRole = $formData['playingRole'] ?? '';
        $battingStyle = $formData['battingStyle'] ?? 'None';
        $bowlingStyle = $formData['bowlingStyle'] ?? 'None';
        $isWicketKeeper = !empty($formData['isWicketKeeper']) ? 1 : 0;
        
        $photoUrl = $uploadedFiles['photo'] ?? '';
        $documentUrl = $uploadedFiles['document'] ?? '';

        // Collect custom properties
        $additional = [];
        $standardKeys = ['name', 'fatherName', 'email', 'mobile', 'address', 'dob', 'playingRole', 'battingStyle', 'bowlingStyle', 'isWicketKeeper', 'photo', 'document'];
        foreach ($schema as $field) {
            $fid = $field['id'];
            if (!in_array($fid, $standardKeys)) {
                if ($field['type'] === 'file') {
                    $additional[$field['label']] = $uploadedFiles[$fid] ?? '';
                } else {
                    $additional[$field['label']] = $formData[$fid] ?? '';
                }
            }
        }

        $additionalJson = !empty($additional) ? json_encode($additional) : null;

        $stmt = $pdo->prepare("INSERT INTO players (id, name, fatherName, email, mobile, address, dob, playingRole, battingStyle, bowlingStyle, isWicketKeeper, photoUrl, documentUrl, status, season, paymentId, additional_fields) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'Season 2', ?, ?)");
        $stmt->execute([
            $id, $name, $fatherName, $email, $mobile, $address, $dob, $playingRole, $battingStyle, $bowlingStyle, $isWicketKeeper, $photoUrl, $documentUrl, $paymentId, $additionalJson
        ]);

        echo json_encode(["success" => true, "message" => "Player registration submitted successfully", "id" => $id]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
