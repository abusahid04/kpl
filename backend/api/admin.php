<?php
require_once 'config.php';

// Verify token helper
function get_authorized_user() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $headers['X-Authorization'] ?? $headers['x-authorization'] ?? '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        $payload = json_decode(base64_decode($token), true);
        if ($payload && isset($payload['exp']) && $payload['exp'] > time()) {
            return $payload;
        }
    }
    return null;
}

$user = get_authorized_user();
if (!$user) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized access"]);
    exit;
}

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'stats':
            // Get stats
            $playersCount = $pdo->query("SELECT COUNT(*) FROM players")->fetchColumn();
            $teamsCount = $pdo->query("SELECT COUNT(*) FROM teams")->fetchColumn();
            $matchesCount = $pdo->query("SELECT COUNT(*) FROM matches")->fetchColumn();
            $sponsorsCount = $pdo->query("SELECT COUNT(*) FROM sponsors")->fetchColumn();
            
            // Get fees
            $playerFee = 0;
            $teamFee = 0;
            
            $stmt = $pdo->prepare("SELECT `value` FROM settings WHERE `key` = ?");
            $stmt->execute(['player_form_payment_fee']);
            $pVal = $stmt->fetchColumn();
            if ($pVal !== false) {
                $playerFee = (float)$pVal;
            }
            
            $stmt->execute(['team_form_payment_fee']);
            $tVal = $stmt->fetchColumn();
            if ($tVal !== false) {
                $teamFee = (float)$tVal;
            }
            
            // Get paid counts
            $playersPaidCount = $pdo->query("SELECT COUNT(*) FROM players WHERE paymentId IS NOT NULL AND paymentId != ''")->fetchColumn();
            $teamsPaidCount = $pdo->query("SELECT COUNT(*) FROM teams WHERE paymentId IS NOT NULL AND paymentId != ''")->fetchColumn();
            
            $playerRevenue = $playersPaidCount * $playerFee;
            
            // Get team payment stats
            $teamPaymentStats = $pdo->query("SELECT SUM(advance_payment) as advance, SUM(remaining_payment) as remaining, SUM(total_payment) as total FROM teams")->fetch(PDO::FETCH_ASSOC);
            $teamAdvanceRevenue = (float)($teamPaymentStats['advance'] ?? 0);
            $teamRemainingRevenue = (float)($teamPaymentStats['remaining'] ?? 0);
            $teamTotalRevenue = (float)($teamPaymentStats['total'] ?? 0);
            
            echo json_encode([
                "players" => $playersCount,
                "teams" => $teamsCount,
                "matches" => $matchesCount,
                "sponsors" => $sponsorsCount,
                "playerRevenue" => $playerRevenue,
                "teamRevenue" => $teamAdvanceRevenue,
                "teamTotalRevenue" => $teamTotalRevenue,
                "teamAdvanceRevenue" => $teamAdvanceRevenue,
                "teamRemainingRevenue" => $teamRemainingRevenue,
                "totalRevenue" => $playerRevenue + $teamAdvanceRevenue,
                "playersPaidCount" => (int)$playersPaidCount,
                "teamsPaidCount" => (int)$teamsPaidCount
            ]);
            break;

        case 'players':
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $stmt = $pdo->query("SELECT p.*, t.name as teamName FROM players p LEFT JOIN teams t ON p.teamId = t.id ORDER BY p.createdAt DESC");
                echo json_encode($stmt->fetchAll());
            } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $playerId = $_POST['playerId'] ?? '';
                $isUpdateDetails = isset($_POST['update_details']) && $_POST['update_details'] == '1';
 
                if ($isUpdateDetails && !empty($playerId)) {
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
                    
                    $uploadDir = '../uploads/';
                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                    }
 
                    // Get current URLs
                    $current = $pdo->prepare("SELECT photoUrl, documentUrl FROM players WHERE id = ?");
                    $current->execute([$playerId]);
                    $currRow = $current->fetch();
                    $photoUrl = $currRow['photoUrl'] ?? '';
                    $documentUrl = $currRow['documentUrl'] ?? '';
 
                    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
                        $photoExt = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
                        $photoName = 'photo_' . time() . '_' . rand(1000, 9999) . '.' . $photoExt;
                        if (move_uploaded_file($_FILES['photo']['tmp_name'], $uploadDir . $photoName)) {
                            $photoUrl = '/kpl/backend/uploads/' . $photoName;
                        }
                    }
 
                    if (isset($_FILES['document']) && $_FILES['document']['error'] === UPLOAD_ERR_OK) {
                        $docExt = pathinfo($_FILES['document']['name'], PATHINFO_EXTENSION);
                        $docName = 'doc_' . time() . '_' . rand(1000, 9999) . '.' . $docExt;
                        if (move_uploaded_file($_FILES['document']['tmp_name'], $uploadDir . $docName)) {
                            $documentUrl = '/kpl/backend/uploads/' . $docName;
                        }
                    }
 
                    $stmt = $pdo->prepare("UPDATE players SET name = ?, fatherName = ?, email = ?, mobile = ?, address = ?, dob = ?, playingRole = ?, battingStyle = ?, bowlingStyle = ?, isWicketKeeper = ?, photoUrl = ?, documentUrl = ? WHERE id = ?");
                    $stmt->execute([
                        $name, $fatherName, $email, $mobile, $address, $dob, $playingRole, $battingStyle, $bowlingStyle, $isWicketKeeper, $photoUrl, $documentUrl, $playerId
                    ]);
                } else {
                    $input = json_decode(file_get_contents('php://input'), true);
                    if (!$input) {
                        $playerId = $_POST['playerId'] ?? '';
                        $status = $_POST['status'] ?? null;
                        $teamId = $_POST['teamId'] ?? null;
                        $paymentId = $_POST['paymentId'] ?? null;
                        $paymentIdUpdated = array_key_exists('paymentId', $_POST);
                    } else {
                        $playerId = $input['playerId'] ?? '';
                        $status = $input['status'] ?? null;
                        $teamId = $input['teamId'] ?? null;
                        $paymentId = $input['paymentId'] ?? null;
                        $paymentIdUpdated = array_key_exists('paymentId', $input);
                    }
 
                    if ($status) {
                        $stmt = $pdo->prepare("UPDATE players SET status = ? WHERE id = ?");
                        $stmt->execute([$status, $playerId]);
                    }
                    $teamIdUpdated = false;
                    $tId = null;
                    if ($input) {
                        if (array_key_exists('teamId', $input)) {
                            $teamIdUpdated = true;
                            $tId = $input['teamId'];
                        }
                    } else {
                        if (array_key_exists('teamId', $_POST)) {
                            $teamIdUpdated = true;
                            $tId = $_POST['teamId'];
                        }
                    }
                    if ($teamIdUpdated) {
                        if ($tId === 'none' || $tId === '') {
                            $tId = null;
                        }
                        $stmt = $pdo->prepare("UPDATE players SET teamId = ? WHERE id = ?");
                        $stmt->execute([$tId, $playerId]);
                    }
                    if ($paymentIdUpdated) {
                        $stmt = $pdo->prepare("UPDATE players SET paymentId = ? WHERE id = ?");
                        $stmt->execute([$paymentId, $playerId]);
                    }
                }
                echo json_encode(["success" => true]);
            }
            break;
 
        case 'teams':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                if ($input && isset($input['update_status']) && !empty($input['teamId'])) {
                    $stmt = $pdo->prepare("UPDATE teams SET status = ? WHERE id = ?");
                    $stmt->execute([$input['status'], $input['teamId']]);
                    echo json_encode(["success" => true]);
                    break;
                }
                $teamId = $_POST['id'] ?? $_GET['id'] ?? '';
                $name = $_POST['name'] ?? '';
                $ownerName = $_POST['ownerName'] ?? '';
                $description = $_POST['description'] ?? '';
                $logoUrl = $_POST['logoUrl'] ?? '';
                $advancePayment = $_POST['advance_payment'] ?? 0;
                $remainingPayment = $_POST['remaining_payment'] ?? 0;
                $totalPayment = $_POST['total_payment'] ?? 0;
 
                $uploadDir = '../uploads/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }
 
                if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION);
                    $fileName = 'team_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                    if (move_uploaded_file($_FILES['logo']['tmp_name'], $uploadDir . $fileName)) {
                        $logoUrl = '/kpl/backend/uploads/' . $fileName;
                    }
                }
 
                if (empty($name)) {
                    $input = json_decode(file_get_contents('php://input'), true);
                    $teamId = $input['id'] ?? $teamId;
                    $name = $input['name'] ?? '';
                    $ownerName = $input['ownerName'] ?? '';
                    $description = $input['description'] ?? '';
                    $logoUrl = $input['logoUrl'] ?? $logoUrl;
                    $advancePayment = $input['advance_payment'] ?? $advancePayment;
                    $remainingPayment = $input['remaining_payment'] ?? $remainingPayment;
                    $totalPayment = $input['total_payment'] ?? $totalPayment;
                }
 
                if (!empty($teamId)) {
                    // Update
                    if (empty($logoUrl)) {
                        $stmt = $pdo->prepare("UPDATE teams SET name = ?, ownerName = ?, description = ?, advance_payment = ?, remaining_payment = ?, total_payment = ? WHERE id = ?");
                        $stmt->execute([$name, $ownerName, $description, $advancePayment, $remainingPayment, $totalPayment, $teamId]);
                    } else {
                        $stmt = $pdo->prepare("UPDATE teams SET name = ?, ownerName = ?, description = ?, logoUrl = ?, advance_payment = ?, remaining_payment = ?, total_payment = ? WHERE id = ?");
                        $stmt->execute([$name, $ownerName, $description, $logoUrl, $advancePayment, $remainingPayment, $totalPayment, $teamId]);
                    }
                    echo json_encode(["success" => true, "id" => $teamId]);
                } else {
                    // Insert
                    $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 4095) | 16384, mt_rand(0, 16383) | 32768, mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
                    $stmt = $pdo->prepare("INSERT INTO teams (id, name, ownerName, description, logoUrl, advance_payment, remaining_payment, total_payment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                    $stmt->execute([$id, $name, $ownerName, $description, $logoUrl, $advancePayment, $remainingPayment, $totalPayment]);
                    echo json_encode(["success" => true, "id" => $id]);
                }
            } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
                $teamId = $_GET['id'] ?? '';
                if (empty($teamId)) {
                    http_response_code(400);
                    echo json_encode(["error" => "Team ID is required"]);
                    exit;
                }
                $stmt = $pdo->prepare("DELETE FROM teams WHERE id = ?");
                $stmt->execute([$teamId]);
                echo json_encode(["success" => true]);
            }
            break;

        case 'announcements':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 4095) | 16384, mt_rand(0, 16383) | 32768, mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
                $title = $input['title'] ?? '';
                $content = $input['content'] ?? '';
                $isPinned = isset($input['isPinned']) && $input['isPinned'] ? 1 : 0;

                $stmt = $pdo->prepare("INSERT INTO announcements (id, title, content, isPinned) VALUES (?, ?, ?, ?)");
                $stmt->execute([$id, $title, $content, $isPinned]);
                echo json_encode(["success" => true, "id" => $id]);
            }
            break;

        case 'sponsors':
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $stmt = $pdo->query("SELECT * FROM sponsors ORDER BY createdAt DESC");
                echo json_encode($stmt->fetchAll());
                break;
            }
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $sponsorId = $_POST['id'] ?? $_GET['id'] ?? '';
                $name = $_POST['name'] ?? '';
                $logoUrl = $_POST['logoUrl'] ?? '';
                $website = $_POST['website'] ?? '';
                $isVisible = isset($_POST['isVisible']) ? intval($_POST['isVisible']) : 1;

                $uploadDir = '../uploads/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION);
                    $fileName = 'sponsor_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                    if (move_uploaded_file($_FILES['logo']['tmp_name'], $uploadDir . $fileName)) {
                        $logoUrl = '/kpl/backend/uploads/' . $fileName;
                    }
                }

                if (empty($name)) {
                    $input = json_decode(file_get_contents('php://input'), true);
                    $sponsorId = $input['id'] ?? $sponsorId;
                    $name = $input['name'] ?? '';
                    $logoUrl = $input['logoUrl'] ?? $logoUrl;
                    $website = $input['website'] ?? '';
                    $isVisible = isset($input['isVisible']) ? intval($input['isVisible']) : $isVisible;
                }

                if (!empty($sponsorId)) {
                    // Update
                    if (empty($logoUrl)) {
                        $stmt = $pdo->prepare("UPDATE sponsors SET name = ?, website = ?, isVisible = ? WHERE id = ?");
                        $stmt->execute([$name, $website, $isVisible, $sponsorId]);
                    } else {
                        $stmt = $pdo->prepare("UPDATE sponsors SET name = ?, website = ?, logoUrl = ?, isVisible = ? WHERE id = ?");
                        $stmt->execute([$name, $website, $logoUrl, $isVisible, $sponsorId]);
                    }
                    echo json_encode(["success" => true, "id" => $sponsorId]);
                } else {
                    // Insert
                    $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 4095) | 16384, mt_rand(0, 16383) | 32768, mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
                    $stmt = $pdo->prepare("INSERT INTO sponsors (id, name, logoUrl, website, isVisible) VALUES (?, ?, ?, ?, ?)");
                    $stmt->execute([$id, $name, $logoUrl, $website, $isVisible]);
                    echo json_encode(["success" => true, "id" => $id]);
                }
            } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
                $input = json_decode(file_get_contents('php://input'), true);
                $sponsorId = $input['id'] ?? '';
                if (empty($sponsorId)) {
                    http_response_code(400);
                    echo json_encode(["error" => "Sponsor ID is required"]);
                    exit;
                }

                // Support toggle of isVisible
                if (isset($input['isVisible'])) {
                    $stmt = $pdo->prepare("UPDATE sponsors SET isVisible = ? WHERE id = ?");
                    $stmt->execute([intval($input['isVisible']), $sponsorId]);
                } else {
                    $name = $input['name'] ?? '';
                    $website = $input['website'] ?? '';
                    $logoUrl = $input['logoUrl'] ?? '';
                    $isVisible = isset($input['isVisible']) ? intval($input['isVisible']) : 1;

                    if (empty($logoUrl)) {
                        $stmt = $pdo->prepare("UPDATE sponsors SET name = ?, website = ?, isVisible = ? WHERE id = ?");
                        $stmt->execute([$name, $website, $isVisible, $sponsorId]);
                    } else {
                        $stmt = $pdo->prepare("UPDATE sponsors SET name = ?, website = ?, logoUrl = ?, isVisible = ? WHERE id = ?");
                        $stmt->execute([$name, $website, $logoUrl, $isVisible, $sponsorId]);
                    }
                }
                echo json_encode(["success" => true]);
            } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
                $sponsorId = $_GET['id'] ?? '';
                if (empty($sponsorId)) {
                    http_response_code(400);
                    echo json_encode(["error" => "Sponsor ID is required"]);
                    exit;
                }
                $stmt = $pdo->prepare("DELETE FROM sponsors WHERE id = ?");
                $stmt->execute([$sponsorId]);
                echo json_encode(["success" => true]);
            }
            break;

        case 'matches':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 4095) | 16384, mt_rand(0, 16383) | 32768, mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
                $date = $input['date'] ?? '';
                $time = $input['time'] ?? '';
                $venue = $input['venue'] ?? '';
                $team1Id = $input['team1Id'] ?? '';
                $team2Id = $input['team2Id'] ?? '';
                $status = $input['status'] ?? 'SCHEDULED';

                $stmt = $pdo->prepare("INSERT INTO matches (id, date, time, venue, team1Id, team2Id, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$id, $date, $time, $venue, $team1Id, $team2Id, $status]);
                echo json_encode(["success" => true, "id" => $id]);
            }
            break;

        case 'gallery':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 4095) | 16384, mt_rand(0, 16383) | 32768, mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
                $type = $_POST['type'] ?? 'IMAGE';
                $url = $_POST['url'] ?? '';
                $thumbnail = $_POST['thumbnail'] ?? '';
                $album = $_POST['album'] ?? '';

                $uploadDir = '../uploads/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                    $fileName = 'gallery_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                    if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $fileName)) {
                        $url = '/kpl/backend/uploads/' . $fileName;
                    }
                }

                if (empty($url) && empty($_FILES['image'])) {
                    $input = json_decode(file_get_contents('php://input'), true);
                    $type = $input['type'] ?? 'IMAGE';
                    $url = $input['url'] ?? '';
                    $thumbnail = $input['thumbnail'] ?? '';
                    $album = $input['album'] ?? '';
                }

                $stmt = $pdo->prepare("INSERT INTO gallery (id, type, url, thumbnail, album) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$id, $type, $url, $thumbnail, $album]);
                echo json_encode(["success" => true, "id" => $id]);
            }
            break;

        case 'admins':
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $stmt = $pdo->query("SELECT a.id, a.username, a.name, a.email, a.phone, a.status, a.roleId, a.createdAt, r.name as roleName FROM admins a LEFT JOIN roles r ON a.roleId = r.id ORDER BY a.createdAt DESC");
                echo json_encode($stmt->fetchAll());
            } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 4095) | 16384, mt_rand(0, 16383) | 32768, mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
                $username = $input['username'] ?? '';
                $password = $input['password'] ?? '';
                $name = $input['name'] ?? '';
                $roleId = $input['roleId'] ?? null;
                $email = $input['email'] ?? '';
                $phone = $input['phone'] ?? '';

                if (empty($username) || empty($password)) {
                    http_response_code(400);
                    echo json_encode(["error" => "Username and password are required"]);
                    exit;
                }

                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

                $stmt = $pdo->prepare("INSERT INTO admins (id, username, password, name, roleId, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$id, $username, $hashedPassword, $name, $roleId, $email, $phone]);
                echo json_encode(["success" => true, "id" => $id]);
            } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
                $input = json_decode(file_get_contents('php://input'), true);
                $id = $input['id'] ?? '';
                $username = $input['username'] ?? '';
                $name = $input['name'] ?? '';
                $roleId = $input['roleId'] ?? null;
                $email = $input['email'] ?? '';
                $phone = $input['phone'] ?? '';
                $password = $input['password'] ?? '';

                if (empty($id) || empty($username)) {
                    http_response_code(400);
                    echo json_encode(["error" => "ID and Username are required"]);
                    exit;
                }

                if (!empty($password)) {
                    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                    $stmt = $pdo->prepare("UPDATE admins SET username = ?, password = ?, name = ?, roleId = ?, email = ?, phone = ? WHERE id = ?");
                    $stmt->execute([$username, $hashedPassword, $name, $roleId, $email, $phone, $id]);
                } else {
                    $stmt = $pdo->prepare("UPDATE admins SET username = ?, name = ?, roleId = ?, email = ?, phone = ? WHERE id = ?");
                    $stmt->execute([$username, $name, $roleId, $email, $phone, $id]);
                }
                echo json_encode(["success" => true]);
            } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
                $adminId = $_GET['id'] ?? '';
                if (empty($adminId)) {
                    http_response_code(400);
                    echo json_encode(["error" => "Admin ID is required"]);
                    exit;
                }
                $stmt = $pdo->prepare("DELETE FROM admins WHERE id = ?");
                $stmt->execute([$adminId]);
                echo json_encode(["success" => true]);
            }
            break;

        case 'roles':
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $stmt = $pdo->query("SELECT * FROM roles ORDER BY createdAt DESC");
                echo json_encode($stmt->fetchAll());
            } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 4095) | 16384, mt_rand(0, 16383) | 32768, mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
                $name = $input['name'] ?? '';
                $permissions = $input['permissions'] ?? '';

                if (empty($name)) {
                    http_response_code(400);
                    echo json_encode(["error" => "Role name is required"]);
                    exit;
                }

                $stmt = $pdo->prepare("INSERT INTO roles (id, name, permissions) VALUES (?, ?, ?)");
                $stmt->execute([$id, $name, $permissions]);
                echo json_encode(["success" => true, "id" => $id]);
            } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
                $input = json_decode(file_get_contents('php://input'), true);
                $id = $input['id'] ?? '';
                $name = $input['name'] ?? '';
                $permissions = $input['permissions'] ?? '';

                if (empty($id) || empty($name)) {
                    http_response_code(400);
                    echo json_encode(["error" => "ID and Role Name are required"]);
                    exit;
                }

                $stmt = $pdo->prepare("UPDATE roles SET name = ?, permissions = ? WHERE id = ?");
                $stmt->execute([$name, $permissions, $id]);
                echo json_encode(["success" => true]);
            } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
                $roleId = $_GET['id'] ?? '';
                if (empty($roleId)) {
                    http_response_code(400);
                    echo json_encode(["error" => "Role ID is required"]);
                    exit;
                }
                $stmt = $pdo->prepare("DELETE FROM roles WHERE id = ?");
                $stmt->execute([$roleId]);
                echo json_encode(["success" => true]);
            }
            break;

        case 'settings':
            $isSuperAdmin = (isset($user['roleName']) && strpos(strtolower($user['roleName']), 'super') !== false) || 
                            ($user['username'] === 'admin') || 
                            ($user['username'] === 'sahid');
            if (!$isSuperAdmin) {
                http_response_code(403);
                echo json_encode(["error" => "Forbidden: Only Super Admins can access or modify settings."]);
                exit;
            }
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $stmt = $pdo->query("SELECT `key`, `value` FROM settings");
                $rows = $stmt->fetchAll();
                $settings = [];
                foreach ($rows as $r) {
                    $settings[$r['key']] = $r['value'];
                }
                echo json_encode($settings);
            } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $data = [];
                if (!empty($_POST)) {
                    $data = $_POST;
                } else {
                    $data = json_decode(file_get_contents('php://input'), true) ?? [];
                }

                $uploadDir = '../uploads/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                // Handle site logo (new key: site_logo_file)
                $logoKey = isset($_FILES['site_logo_file']) ? 'site_logo_file' : (isset($_FILES['site_logo']) ? 'site_logo' : null);
                if ($logoKey && $_FILES[$logoKey]['error'] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($_FILES[$logoKey]['name'], PATHINFO_EXTENSION);
                    $fileName = 'logo_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                    if (move_uploaded_file($_FILES[$logoKey]['tmp_name'], $uploadDir . $fileName)) {
                        $data['site_logo'] = '/kpl/backend/uploads/' . $fileName;
                    }
                }

                // Handle favicon (new key: site_favicon_file)
                $faviconKey = isset($_FILES['site_favicon_file']) ? 'site_favicon_file' : (isset($_FILES['site_favicon']) ? 'site_favicon' : null);
                if ($faviconKey && $_FILES[$faviconKey]['error'] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($_FILES[$faviconKey]['name'], PATHINFO_EXTENSION);
                    $fileName = 'favicon_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                    if (move_uploaded_file($_FILES[$faviconKey]['tmp_name'], $uploadDir . $fileName)) {
                        $data['site_favicon'] = '/kpl/backend/uploads/' . $fileName;
                    }
                }

                // Handle landing page image uploads
                $landingImageFields = [
                    'landing_hero_image_file'   => 'landing_hero_image',
                    'landing_player_image_file' => 'landing_player_image',
                    'landing_stats_image_file'  => 'landing_stats_image',
                    'landing_team_image_file'   => 'landing_team_image',
                    'landing_trophy_image_file' => 'landing_trophy_image',
                ];
                foreach ($landingImageFields as $fileKey => $settingKey) {
                    if (isset($_FILES[$fileKey]) && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
                        $ext = pathinfo($_FILES[$fileKey]['name'], PATHINFO_EXTENSION);
                        $fileName = 'landing_' . str_replace('_image_file', '', $fileKey) . '_' . time() . '.' . $ext;
                        if (move_uploaded_file($_FILES[$fileKey]['tmp_name'], $uploadDir . $fileName)) {
                            $data[$settingKey] = '/kpl/backend/uploads/' . $fileName;
                        }
                    }
                }

                // Skip internal file keys from being stored as settings
                $skipKeys = array_keys($landingImageFields);
                $skipKeys[] = 'site_logo_file';
                $skipKeys[] = 'site_favicon_file';

                foreach ($data as $key => $value) {
                    if (in_array($key, $skipKeys)) continue;
                    $stmt = $pdo->prepare("INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?");
                    $stmt->execute([$key, $value, $value]);
                }
                echo json_encode(["success" => true]);
            }
            break;


        case 'profile':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                try {
                    $pdo->exec("ALTER TABLE admins ADD COLUMN avatarUrl VARCHAR(500) NULL AFTER phone");
                } catch (\PDOException $e) {}

                $id = $user['id'];
                $name = $_POST['name'] ?? '';
                $phone = $_POST['phone'] ?? '';
                $password = $_POST['password'] ?? '';
                
                $avatarUrl = null;

                $uploadDir = '../uploads/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
                    $fileName = 'avatar_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                    if (move_uploaded_file($_FILES['avatar']['tmp_name'], $uploadDir . $fileName)) {
                        $avatarUrl = '/kpl/backend/uploads/' . $fileName;
                    }
                }

                if (!empty($password)) {
                    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                    if ($avatarUrl) {
                        $stmt = $pdo->prepare("UPDATE admins SET name = ?, phone = ?, password = ?, avatarUrl = ? WHERE id = ?");
                        $stmt->execute([$name, $phone, $hashedPassword, $avatarUrl, $id]);
                    } else {
                        $stmt = $pdo->prepare("UPDATE admins SET name = ?, phone = ?, password = ? WHERE id = ?");
                        $stmt->execute([$name, $phone, $hashedPassword, $id]);
                    }
                } else {
                    if ($avatarUrl) {
                        $stmt = $pdo->prepare("UPDATE admins SET name = ?, phone = ?, avatarUrl = ? WHERE id = ?");
                        $stmt->execute([$name, $phone, $avatarUrl, $id]);
                    } else {
                        $stmt = $pdo->prepare("UPDATE admins SET name = ?, phone = ? WHERE id = ?");
                        $stmt->execute([$name, $phone, $id]);
                    }
                }

                // Fetch updated user info to send back
                $stmt = $pdo->prepare("SELECT a.id, a.username, a.name, a.email, a.phone, a.avatarUrl, r.name as roleName FROM admins a LEFT JOIN roles r ON a.roleId = r.id WHERE a.id = ?");
                $stmt->execute([$id]);
                $updatedUser = $stmt->fetch();

                echo json_encode(["success" => true, "user" => $updatedUser]);
            }
            break;

        case 'seed':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                // Let's seed demo teams first
                $demoTeams = [
                    [
                        "id" => "team-kings",
                        "name" => "Khoraghat Kings",
                        "ownerName" => "Rajesh Kumar",
                        "description" => "The reigning champions of Khoraghat, known for their aggressive batting style and solid top order.",
                        "logoUrl" => "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    ],
                    [
                        "id" => "team-titans",
                        "name" => "Teesta Titans",
                        "ownerName" => "Suresh Patel",
                        "description" => "A high-octane franchise featuring key all-rounders and a formidable pace bowling attack.",
                        "logoUrl" => "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    ],
                    [
                        "id" => "team-defenders",
                        "name" => "Dharla Defenders",
                        "ownerName" => "Amit Hasan",
                        "description" => "The most disciplined team in the league, famous for choking opponents in low-scoring chases.",
                        "logoUrl" => "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    ],
                    [
                        "id" => "team-knights",
                        "name" => "Karatoa Knights",
                        "ownerName" => "Mustafizur Rahman",
                        "description" => "A blend of veteran players and rising young talent, always ready for a tactical fight.",
                        "logoUrl" => "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    ]
                ];

                foreach ($demoTeams as $t) {
                    $stmt = $pdo->prepare("INSERT INTO teams (id, name, ownerName, description, logoUrl) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), ownerName=VALUES(ownerName), description=VALUES(description), logoUrl=VALUES(logoUrl)");
                    $stmt->execute([$t['id'], $t['name'], $t['ownerName'], $t['description'], $t['logoUrl']]);
                }

                // Seed demo players
                $demoPlayers = [
                    [
                        "id" => "player-1",
                        "name" => "Tamim Iqbal",
                        "fatherName" => "Iqbal Khan",
                        "email" => "tamim@example.com",
                        "mobile" => "01711111111",
                        "address" => "Khoraghat Sadar",
                        "dob" => "1989-03-20",
                        "playingRole" => "Batsman",
                        "battingStyle" => "Left Hand",
                        "bowlingStyle" => "None",
                        "isWicketKeeper" => 0,
                        "photoUrl" => "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60",
                        "teamId" => "team-kings",
                        "status" => "APPROVED"
                    ],
                    [
                        "id" => "player-2",
                        "name" => "Shakib Al Hasan",
                        "fatherName" => "Mashrofe Hasan",
                        "email" => "shakib@example.com",
                        "mobile" => "01722222222",
                        "address" => "Teesta River View Area",
                        "dob" => "1987-03-24",
                        "playingRole" => "All-Rounder",
                        "battingStyle" => "Left Hand",
                        "bowlingStyle" => "Slow Left Arm Orthodox",
                        "isWicketKeeper" => 0,
                        "photoUrl" => "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60",
                        "teamId" => "team-titans",
                        "status" => "APPROVED"
                    ],
                    [
                        "id" => "player-3",
                        "name" => "Mushfiqur Rahim",
                        "fatherName" => "Rahim Uddin",
                        "email" => "mushy@example.com",
                        "mobile" => "01733333333",
                        "address" => "Dharla Crossing",
                        "dob" => "1987-06-09",
                        "playingRole" => "Wicketkeeper Batsman",
                        "battingStyle" => "Right Hand",
                        "bowlingStyle" => "None",
                        "isWicketKeeper" => 1,
                        "photoUrl" => "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
                        "teamId" => "team-defenders",
                        "status" => "APPROVED"
                    ],
                    [
                        "id" => "player-4",
                        "name" => "Mashrafe Mortaza",
                        "fatherName" => "Golam Mortaza",
                        "email" => "mashrafe@example.com",
                        "mobile" => "01744444444",
                        "address" => "Karatoa Ghat",
                        "dob" => "1983-10-05",
                        "playingRole" => "Bowler",
                        "battingStyle" => "Right Hand",
                        "bowlingStyle" => "Right Arm Fast Medium",
                        "isWicketKeeper" => 0,
                        "photoUrl" => "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=60",
                        "teamId" => "team-knights",
                        "status" => "APPROVED"
                    ],
                    [
                        "id" => "player-5",
                        "name" => "Mustafizur Rahman",
                        "fatherName" => "Abul Qasem",
                        "email" => "fizz@example.com",
                        "mobile" => "01755555555",
                        "address" => "Khoraghat Bypass",
                        "dob" => "1995-09-06",
                        "playingRole" => "Bowler",
                        "battingStyle" => "Left Hand",
                        "bowlingStyle" => "Left Arm Fast Medium",
                        "isWicketKeeper" => 0,
                        "photoUrl" => "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60",
                        "teamId" => "team-kings",
                        "status" => "APPROVED"
                    ],
                    [
                        "id" => "player-6",
                        "name" => "Liton Das",
                        "fatherName" => "Das Babu",
                        "email" => "liton@example.com",
                        "mobile" => "01766666666",
                        "address" => "Teesta Bazar",
                        "dob" => "1994-10-13",
                        "playingRole" => "Batsman",
                        "battingStyle" => "Right Hand",
                        "bowlingStyle" => "None",
                        "isWicketKeeper" => 1,
                        "photoUrl" => "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=60",
                        "teamId" => "team-titans",
                        "status" => "APPROVED"
                    ],
                    [
                        "id" => "player-7",
                        "name" => "Taskin Ahmed",
                        "fatherName" => "Ahmed Ali",
                        "email" => "taskin@example.com",
                        "mobile" => "01777777777",
                        "address" => "Dharla Bridge Road",
                        "dob" => "1995-04-03",
                        "playingRole" => "Bowler",
                        "battingStyle" => "Right Hand",
                        "bowlingStyle" => "Right Arm Fast",
                        "isWicketKeeper" => 0,
                        "photoUrl" => "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=60",
                        "teamId" => "team-defenders",
                        "status" => "PENDING"
                    ],
                    [
                        "id" => "player-8",
                        "name" => "Mahmudullah Riyad",
                        "fatherName" => "Riyad Uddin",
                        "email" => "riyad@example.com",
                        "mobile" => "01788888888",
                        "address" => "Karatoa Town",
                        "dob" => "1986-02-04",
                        "playingRole" => "All-Rounder",
                        "battingStyle" => "Right Hand",
                        "bowlingStyle" => "Right Arm Off Break",
                        "isWicketKeeper" => 0,
                        "photoUrl" => "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60",
                        "teamId" => "team-knights",
                        "status" => "APPROVED"
                    ]
                ];

                foreach ($demoPlayers as $p) {
                    $stmt = $pdo->prepare("INSERT INTO players (id, name, fatherName, email, mobile, address, dob, playingRole, battingStyle, bowlingStyle, isWicketKeeper, photoUrl, teamId, status, season) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Season 2') ON DUPLICATE KEY UPDATE name=VALUES(name), fatherName=VALUES(fatherName), email=VALUES(email), mobile=VALUES(mobile), address=VALUES(address), dob=VALUES(dob), playingRole=VALUES(playingRole), battingStyle=VALUES(battingStyle), bowlingStyle=VALUES(bowlingStyle), isWicketKeeper=VALUES(isWicketKeeper), photoUrl=VALUES(photoUrl), teamId=VALUES(teamId), status=VALUES(status)");
                    $stmt->execute([
                        $p['id'], $p['name'], $p['fatherName'], $p['email'], $p['mobile'], $p['address'], $p['dob'], $p['playingRole'], $p['battingStyle'], $p['bowlingStyle'], $p['isWicketKeeper'], $p['photoUrl'], $p['teamId'], $p['status']
                    ]);
                }

                echo json_encode(["success" => true, "message" => "Sample teams and players loaded successfully!"]);
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(["error" => "Invalid action"]);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
