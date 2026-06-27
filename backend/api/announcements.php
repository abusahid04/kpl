<?php
require_once 'config.php';

try {
    $stmt = $pdo->prepare("SELECT * FROM announcements ORDER BY isPinned DESC, createdAt DESC");
    $stmt->execute();
    $announcements = $stmt->fetchAll();
    echo json_encode($announcements);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
