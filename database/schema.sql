CREATE DATABASE IF NOT EXISTS kpl_db;
USE kpl_db;

-- Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    permissions TEXT NOT NULL, -- comma-separated list of permissions
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NULL,
    email VARCHAR(100) NULL,
    phone VARCHAR(20) NULL,
    status VARCHAR(50) DEFAULT 'Verified',
    password VARCHAR(255) NOT NULL,
    roleId VARCHAR(36) NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ownerName VARCHAR(255) NULL,
    description TEXT NULL,
    logoUrl VARCHAR(500) NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Players Table
CREATE TABLE IF NOT EXISTS players (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    fatherName VARCHAR(255) NOT NULL,
    email VARCHAR(100) NULL,
    mobile VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    dob DATE NOT NULL,
    playingRole VARCHAR(50) NOT NULL, -- Batsman, Bowler, All-Rounder, Wicket Keeper
    battingStyle VARCHAR(50) NULL, -- Right Hand, Left Hand, None
    bowlingStyle VARCHAR(50) NULL,
    isWicketKeeper TINYINT(1) DEFAULT 0,
    photoUrl VARCHAR(500) NOT NULL,
    documentUrl VARCHAR(500) NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    season VARCHAR(50) DEFAULT 'Season 2',
    paymentId VARCHAR(100) NULL,
    teamId VARCHAR(36) NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teamId) REFERENCES teams(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Matches Table
CREATE TABLE IF NOT EXISTS matches (
    id VARCHAR(36) PRIMARY KEY,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    team1Id VARCHAR(36) NOT NULL,
    team2Id VARCHAR(36) NOT NULL,
    status VARCHAR(50) DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, CANCELLED
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team1Id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (team2Id) REFERENCES teams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    isPinned TINYINT(1) DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(20) NOT NULL, -- IMAGE, VIDEO
    url VARCHAR(500) NOT NULL,
    thumbnail VARCHAR(500) NULL,
    album VARCHAR(100) NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sponsors Table
CREATE TABLE IF NOT EXISTS sponsors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logoUrl VARCHAR(500) NOT NULL,
    website VARCHAR(255) NULL,
    isVisible TINYINT(1) DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
    `key` VARCHAR(100) PRIMARY KEY,
    `value` TEXT NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial data
INSERT IGNORE INTO settings (`key`, `value`) VALUES 
('hero_badge', 'Season 2 Begins Soon'),
('hero_title', 'WHERE LOCAL CRICKET COMES ALIVE'),
('hero_description', 'Experience the thrill of the most prestigious hard tennis cricket tournament in Assam.');

-- Seed default roles
INSERT IGNORE INTO roles (id, name, permissions) VALUES 
('role-uuid-superadmin', 'Super Admin', 'players,teams,matches,gallery,sponsors,announcements');

-- Seed default admins
INSERT IGNORE INTO admins (id, username, password, name, roleId) VALUES 
('admin-uuid-1234', 'admin', '$2y$10$9T9OBzO/zV1Qj8lH557ydu3jW20llYhyuaFZTcQBgVyYtVR1Iz3ae', 'System Admin', 'role-uuid-superadmin'),
('admin-uuid-sahid', 'sahid', '$2y$10$gP0t00pmTL4MOp0JhSxA2e75vNRT/hLp4tNLsqryzLyQNNAjCOcM6', 'Sahid', 'role-uuid-superadmin');
