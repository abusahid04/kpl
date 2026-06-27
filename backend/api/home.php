<?php
require_once 'config.php';

try {
    // 1. Teams
    $stmt = $pdo->prepare("SELECT id, name, logoUrl, description FROM teams LIMIT 4");
    $stmt->execute();
    $teams = $stmt->fetchAll();
    
    foreach ($teams as &$team) {
        $playerStmt = $pdo->prepare("SELECT id FROM players WHERE teamId = ?");
        $playerStmt->execute([$team['id']]);
        $team['players'] = $playerStmt->fetchAll();
    }

    // 2. Announcements
    $stmt = $pdo->prepare("SELECT id, title, content, isPinned, createdAt FROM announcements ORDER BY createdAt DESC LIMIT 3");
    $stmt->execute();
    $announcements = $stmt->fetchAll();

    // 3. Sponsors
    $stmt = $pdo->prepare("SELECT id, name, logoUrl, website FROM sponsors WHERE isVisible = 1 LIMIT 6");
    $stmt->execute();
    $sponsors = $stmt->fetchAll();

    // 4. Gallery
    $stmt = $pdo->prepare("SELECT id, type, url, album, createdAt FROM gallery WHERE type = 'IMAGE' ORDER BY createdAt DESC LIMIT 6");
    $stmt->execute();
    $gallery = $stmt->fetchAll();

    // 5. Settings
    $stmt = $pdo->prepare("SELECT `key`, `value` FROM settings WHERE `key` IN ('hero_badge', 'hero_title', 'hero_description', 'landing_hero_image', 'landing_player_image', 'landing_stats_image', 'landing_team_image', 'landing_trophy_image')");
    $stmt->execute();
    $settingsList = $stmt->fetchAll();
    
    $settings = [];
    foreach ($settingsList as $s) {
        $settings[$s['key']] = $s['value'];
    }

    echo json_encode([
        "teams"            => $teams,
        "announcements"    => $announcements,
        "sponsors"         => $sponsors,
        "gallery"          => $gallery,
        "heroBadge"        => $settings['hero_badge'] ?? "Season 2 Begins Soon",
        "heroTitle"        => $settings['hero_title'] ?? "WHERE LOCAL CRICKET COMES ALIVE",
        "heroDescription"  => $settings['hero_description'] ?? "Experience the thrill of the most prestigious hard tennis cricket tournament in Assam.",
        "landingHeroImage"   => $settings['landing_hero_image'] ?? "",
        "landingPlayerImage" => $settings['landing_player_image'] ?? "",
        "landingStatsImage"  => $settings['landing_stats_image'] ?? "",
        "landingTeamImage"   => $settings['landing_team_image'] ?? "",
        "landingTrophyImage" => $settings['landing_trophy_image'] ?? ""
    ]);

} catch (\PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
