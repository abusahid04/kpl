-- KPL Season 2 Complete SQL Schema
-- Ensure you create the database first: CREATE DATABASE kpl_db; USE kpl_db;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table Structure for `settings`
-- --------------------------------------------------------
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` text,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings
INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('site_title', 'Khoraghat Premier League'),
('site_favicon', '/favicon.ico'),
('landingHeroImage', ''),
('landingPlayerImage', ''),
('landingStatsImage', ''),
('landingTeamImage', ''),
('landingTrophyImage', ''),
('heroBadge', 'SEASON 2 REGISTRATIONS OPEN'),
('heroTitle', 'WHERE LOCAL CRICKET COMES ALIVE'),
('heroDescription', 'Experience the thrill of the most prestigious hard tennis cricket tournament in Assam.');

-- --------------------------------------------------------
-- Table Structure for `users` (Admins)
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin (Password is 'admin123' - you should hash this using password_hash in PHP)
-- E.g. $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi is bcrypt for 'password'
INSERT INTO `users` (`username`, `password_hash`, `role`) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin');

-- --------------------------------------------------------
-- Table Structure for `teams`
-- --------------------------------------------------------
CREATE TABLE `teams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `owner_name` varchar(255) DEFAULT NULL,
  `description` text,
  `logoUrl` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table Structure for `players`
-- --------------------------------------------------------
CREATE TABLE `players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `team_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('Batsman','Bowler','All-Rounder','Wicket Keeper') NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT '0.00',
  `status` enum('registered','auctioned','unsold') DEFAULT 'registered',
  `contact_number` varchar(20) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table Structure for `announcements`
-- --------------------------------------------------------
CREATE TABLE `announcements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `isPinned` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table Structure for `sponsors`
-- --------------------------------------------------------
CREATE TABLE `sponsors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `logoUrl` varchar(255) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `sponsor_tier` enum('title','platinum','gold','silver','partner') DEFAULT 'partner',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table Structure for `gallery`
-- --------------------------------------------------------
CREATE TABLE `gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('image','video') NOT NULL DEFAULT 'image',
  `url` varchar(255) NOT NULL,
  `album` varchar(255) DEFAULT 'Season 1',
  `title` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table Structure for `matches`
-- --------------------------------------------------------
CREATE TABLE `matches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `team1_id` int(11) NOT NULL,
  `team2_id` int(11) NOT NULL,
  `match_date` datetime NOT NULL,
  `venue` varchar(255) DEFAULT 'Khoraghat Stadium',
  `status` enum('upcoming','live','completed') DEFAULT 'upcoming',
  `winner_team_id` int(11) DEFAULT NULL,
  `score_team1` varchar(50) DEFAULT NULL,
  `score_team2` varchar(50) DEFAULT NULL,
  `overs_team1` varchar(10) DEFAULT NULL,
  `overs_team2` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`team1_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`team2_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`winner_team_id`) REFERENCES `teams`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
