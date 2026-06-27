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

    $id = gen_uuid();
    $name = $_POST['name'] ?? '';
    $fatherName = $_POST['fatherName'] ?? '';
    $email = $_POST['email'] ?? '';
    $mobile = $_POST['mobile'] ?? '';
    $address = $_POST['address'] ?? '';
    $dob = $_POST['dob'] ?? '';
    $playingRole = $_POST['playingRole'] ?? '';
    $battingStyle = $_POST['battingStyle'] ?? '';
    $bowlingStyle = $_POST['bowlingStyle'] ?? '';
    $isWicketKeeper = isset($_POST['isWicketKeeper']) && ($_POST['isWicketKeeper'] === 'true' || $_POST['isWicketKeeper'] == 1) ? 1 : 0;
    
    // File uploads handling
    $uploadDir = '../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $photoUrl = '';
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $photoExt = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
        $photoName = 'photo_' . time() . '_' . rand(1000, 9999) . '.' . $photoExt;
        if (move_uploaded_file($_FILES['photo']['tmp_name'], $uploadDir . $photoName)) {
            $photoUrl = '/kpl/backend/uploads/' . $photoName;
        }
    }

    $documentUrl = '';
    if (isset($_FILES['document']) && $_FILES['document']['error'] === UPLOAD_ERR_OK) {
        $docExt = pathinfo($_FILES['document']['name'], PATHINFO_EXTENSION);
        $docName = 'doc_' . time() . '_' . rand(1000, 9999) . '.' . $docExt;
        if (move_uploaded_file($_FILES['document']['tmp_name'], $uploadDir . $docName)) {
            $documentUrl = '/kpl/backend/uploads/' . $docName;
        }
    }

    if (empty($name) || empty($fatherName) || empty($mobile) || empty($address) || empty($dob) || empty($playingRole) || empty($photoUrl)) {
        http_response_code(400);
        echo json_encode(["error" => "Required fields or photo missing"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO players (id, name, fatherName, email, mobile, address, dob, playingRole, battingStyle, bowlingStyle, isWicketKeeper, photoUrl, documentUrl, status, season) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'Season 2')");
    $stmt->execute([
        $id, $name, $fatherName, $email, $mobile, $address, $dob, $playingRole, $battingStyle, $bowlingStyle, $isWicketKeeper, $photoUrl, $documentUrl
    ]);

    echo json_encode(["success" => true, "message" => "Registration submitted successfully", "id" => $id]);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
