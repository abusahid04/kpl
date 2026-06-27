<?php
require_once 'config.php';

$id = $_GET['id'] ?? null;

try {
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM teams WHERE id = ?");
        $stmt->execute([$id]);
        $team = $stmt->fetch();
        
        if ($team) {
            $playerStmt = $pdo->prepare("SELECT * FROM players WHERE teamId = ? AND status = 'APPROVED'");
            $playerStmt->execute([$id]);
            $team['players'] = $playerStmt->fetchAll();
            echo json_encode($team);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Team not found"]);
        }
    } else {
        $stmt = $pdo->prepare("SELECT * FROM teams");
        $stmt->execute();
        $teams = $stmt->fetchAll();
        
        foreach ($teams as &$t) {
            $playerStmt = $pdo->prepare("SELECT * FROM players WHERE teamId = ? AND status = 'APPROVED'");
            $playerStmt->execute([$t['id']]);
            $t['players'] = $playerStmt->fetchAll();
        }
        echo json_encode($teams);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
