<?php
declare(strict_types=1);
require_once __DIR__ . '/_helpers.php';

// Only allow if no users exist or secured by a secret key?
// For now, let's just allow it but maybe check if tables exist to avoid errors.

try {
    $pdo = migewlito_get_db();
    
    // 1. Users Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100),
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'member',
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // 2. Games Status Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS games_status (
        page VARCHAR(100) PRIMARY KEY,
        maintenance BOOLEAN DEFAULT FALSE,
        message TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // 3. Catalog Overrides Table
    // We use TEXT for JSON because not all SQL drivers support JSON type identically in PDO without specific drivers
    // But Vercel Postgres supports JSONB. Let's use TEXT for compatibility, it's safe enough for small data.
    $pdo->exec("CREATE TABLE IF NOT EXISTS catalog_overrides (
        page VARCHAR(100) PRIMARY KEY,
        products TEXT, 
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    echo "Database tables created successfully.";

} catch (Exception $e) {
    http_response_code(500);
    echo "Error setting up database: " . $e->getMessage();
}
