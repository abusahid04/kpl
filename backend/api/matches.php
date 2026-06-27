<?php
require_once 'config.php';

try {
    $stmt = $pdo->prepare("
        SELECT m.*, 
               t1.name AS team1Name, t1.logoUrl AS team1Logo,
               t2.name AS team2Name, t2.logoUrl AS team2Logo
        FROM matches m
        JOIN teams t1 ON m.team1Id = t1.id
        JOIN teams t2 ON m.team2Id = t2.id
        ORDER BY m.date ASC, m.time ASC
    ");
    $stmt->execute();
    $matches = $stmt->fetchAll();
    echo json_encode($matches);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
