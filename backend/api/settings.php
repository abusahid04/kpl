<?php
require_once 'config.php';

try {
    $stmt = $pdo->query("SELECT `key`, `value` FROM settings");
    $rows = $stmt->fetchAll();
    
    $settings = [];
    foreach ($rows as $r) {
        $settings[$r['key']] = $r['value'];
    }
    
    echo json_encode($settings);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
