<?php
declare(strict_types=1);

function migewlito_get_db(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    // Check for config file first
    $configFile = __DIR__ . '/config.php';
    if (file_exists($configFile)) {
        require_once $configFile;
    }

    $url = $_SERVER['POSTGRES_URL'] ?? $_SERVER['DATABASE_URL'] ?? (defined('DATABASE_URL') ? constant('DATABASE_URL') : '') ?? '';
    
    // Construct URL from constants if no URL provided
    if (!$url && defined('DB_HOST') && defined('DB_NAME')) {
        $host = constant('DB_HOST');
        $port = defined('DB_PORT') ? constant('DB_PORT') : 3306;
        $name = constant('DB_NAME');
        $user = defined('DB_USER') ? constant('DB_USER') : 'root';
        $pass = defined('DB_PASS') ? constant('DB_PASS') : '';
        
        $dsn = "mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4";
        try {
            $pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
            return $pdo;
        } catch (PDOException $e) {
            // Fallthrough to try other methods or error out
        }
    }

    if (!$url) {
        // Fallback for local XAMPP without config
        if ($_SERVER['SERVER_NAME'] === 'localhost' || $_SERVER['SERVER_NAME'] === '127.0.0.1') {
            try {
                $pdo = new PDO('mysql:host=localhost;dbname=migewlito', 'root', '');
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                return $pdo;
            } catch (PDOException $e) {
                // Ignore
            }
        }
        
        throw new Exception('Database connection failed. Please check api/config.php');
    }

    // Parse URL for PDO
    $parts = parse_url($url);
    $scheme = $parts['scheme'] ?? '';
    
    if ($scheme === 'postgres' || $scheme === 'postgresql') {
        $dsn = sprintf(
            "pgsql:host=%s;port=%d;dbname=%s;user=%s;password=%s",
            $parts['host'] ?? 'localhost',
            $parts['port'] ?? 5432,
            ltrim($parts['path'] ?? '', '/'),
            $parts['user'] ?? '',
            $parts['pass'] ?? ''
        );
        
        // Vercel Postgres requires SSL mode
        if (strpos($url, 'vercel-storage.com') !== false || strpos($url, 'neon.tech') !== false) {
             $dsn .= ";sslmode=require";
        }
    } elseif ($scheme === 'mysql') {
        $dsn = sprintf(
            "mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4",
            $parts['host'] ?? 'localhost',
            $parts['port'] ?? 3306,
            ltrim($parts['path'] ?? '', '/')
        );
    } else {
        throw new Exception("Unsupported database scheme: $scheme");
    }

    $user = $parts['user'] ?? null;
    $pass = $parts['pass'] ?? null;

    // For MySQL/Postgres generic
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    $pdo = new PDO($dsn, $user, $pass, $options);
    return $pdo;
}

function migewlito_json_response(array $payload, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function migewlito_require_method(string $method): void {
    $m = strtoupper($_SERVER['REQUEST_METHOD'] ?? '');
    if ($m !== strtoupper($method)) {
        migewlito_json_response(['success' => false, 'error' => 'Method not allowed'], 405);
    }
}

function migewlito_start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_name('MIGEWLITOSESSID');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,
        'secure' => $secure,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function migewlito_public_user(array $u): array {
    return [
        'id' => $u['id'] ?? '',
        'email' => $u['email'] ?? '',
        'username' => $u['username'] ?? '',
        'name' => $u['name'] ?? '',
        'role' => $u['role'] ?? 'member',
        'avatar_url' => $u['avatar_url'] ?? '',
    ];
}

function migewlito_get_current_user(): ?array {
    migewlito_start_session();
    $uid = $_SESSION['user_id'] ?? '';
    if (!$uid) return null;
    
    try {
        $db = migewlito_get_db();
        $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$uid]);
        $u = $stmt->fetch();
        return $u ?: null;
    } catch (Exception $e) {
        return null;
    }
}

function migewlito_require_login(): array {
    $u = migewlito_get_current_user();
    if (!$u) {
        migewlito_json_response(['success' => false, 'error' => 'Unauthorized'], 401);
    }
    return $u;
}

function migewlito_is_admin(?array $u): bool {
    if (!$u) return false;
    return strtolower((string)($u['role'] ?? '')) === 'admin';
}

function migewlito_require_admin(): array {
    $u = migewlito_require_login();
    if (!migewlito_is_admin($u)) {
        migewlito_json_response(['success' => false, 'error' => 'Forbidden'], 403);
    }
    return $u;
}

function migewlito_read_body(): array {
    $ct = strtolower((string)($_SERVER['CONTENT_TYPE'] ?? ''));
    if (strpos($ct, 'application/json') !== false) {
        $raw = file_get_contents('php://input');
        $decoded = json_decode($raw ?: '[]', true);
        return is_array($decoded) ? $decoded : [];
    }
    return is_array($_POST ?? null) ? $_POST : [];
}

function migewlito_sanitize_game_page(string $page): string {
    $p = str_replace('\\', '/', trim($page));
    $p = preg_replace('/[^a-zA-Z0-9_\-\/\.]/', '', $p) ?? '';
    $p = preg_replace('/\/+/', '/', $p) ?? '';
    $p = ltrim($p, '/');
    if (!str_starts_with($p, 'games/')) return '';
    if (!str_ends_with($p, '.html')) return '';
    return $p;
}
