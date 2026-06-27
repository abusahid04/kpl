<?php
require_once 'config.php';

try {
    $stmt = $pdo->prepare("SELECT * FROM sponsors WHERE isVisible = 1 ORDER BY createdAt DESC");
    $stmt->execute();
    $sponsors = $stmt->fetchAll();
    echo json_encode($sponsors);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
