<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "Username and password are required"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT a.*, r.name as roleName FROM admins a LEFT JOIN roles r ON a.roleId = r.id WHERE a.username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if ($admin && password_verify($password, $admin['password'])) {
        // Return a mock JWT/Token session
        $token = base64_encode(json_encode(["id" => $admin['id'], "username" => $admin['username'], "roleName" => $admin['roleName'], "exp" => time() + 86400]));
        echo json_encode([
            "success" => true,
            "token" => $token,
            "user" => [
                "id" => $admin['id'],
                "username" => $admin['username'],
                "name" => $admin['name'],
                "roleName" => $admin['roleName']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid username or password"]);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
