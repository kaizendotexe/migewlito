<?php
declare(strict_types=1);
require_once __DIR__ . '/_helpers.php';

migewlito_require_admin();

$page = migewlito_sanitize_game_page((string)($_GET['page'] ?? ''));
if (!$page) {
    migewlito_json_response(['success' => false, 'error' => 'Invalid page'], 400);
}

$games = migewlito_read_json_file(migewlito_games_status_path(), []);
$overrides = migewlito_read_json_file(migewlito_catalog_overrides_path(), []);

$g = is_array($games[$page] ?? null) ? $games[$page] : [];
$o = is_array($overrides[$page] ?? null) ? $overrides[$page] : [];

migewlito_json_response([
    'success' => true,
    'page' => $page,
    'maintenance' => (bool)($g['maintenance'] ?? false),
    'message' => (string)($g['message'] ?? ''),
    'products' => is_array($o['products'] ?? null) ? $o['products'] : [],
]);

