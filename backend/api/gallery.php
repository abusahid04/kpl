<?php
require_once 'config.php';

try {
    $stmt = $pdo->prepare("SELECT * FROM gallery ORDER BY createdAt DESC");
    $stmt->execute();
    $gallery = $stmt->fetchAll();
    echo json_encode($gallery);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
