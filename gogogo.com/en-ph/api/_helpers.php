<?php
declare(strict_types=1);

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

function migewlito_data_dir(): string {
    $dir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data';
    if (!is_dir($dir)) {
        @mkdir($dir, 0775, true);
    }
    return $dir;
}

function migewlito_read_json_file(string $path, $default) {
    if (!is_file($path)) return $default;
    $raw = @file_get_contents($path);
    if ($raw === false) return $default;
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) return $default;
    return $decoded;
}

function migewlito_write_json_file(string $path, array $data): bool {
    $dir = dirname($path);
    if (!is_dir($dir)) {
        @mkdir($dir, 0775, true);
    }
    $tmp = $path . '.tmp.' . bin2hex(random_bytes(6));
    $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    if ($json === false) return false;
    if (@file_put_contents($tmp, $json, LOCK_EX) === false) return false;
    return @rename($tmp, $path);
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

function migewlito_users_path(): string {
    return migewlito_data_dir() . DIRECTORY_SEPARATOR . 'users.json';
}

function migewlito_games_status_path(): string {
    return migewlito_data_dir() . DIRECTORY_SEPARATOR . 'games_status.json';
}

function migewlito_catalog_overrides_path(): string {
    return migewlito_data_dir() . DIRECTORY_SEPARATOR . 'catalog_overrides.json';
}

function migewlito_get_users(): array {
    return migewlito_read_json_file(migewlito_users_path(), []);
}

function migewlito_save_users(array $users): bool {
    return migewlito_write_json_file(migewlito_users_path(), $users);
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
    $users = migewlito_get_users();
    foreach ($users as $u) {
        if (($u['id'] ?? '') === $uid) return $u;
    }
    return null;
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
