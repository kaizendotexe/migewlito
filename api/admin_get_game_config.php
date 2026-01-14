<?php
declare(strict_types=1);
require_once __DIR__ . '/_helpers.php';

migewlito_require_admin();

$page = migewlito_sanitize_game_page((string)($_GET['page'] ?? ''));
if (!$page) {
    migewlito_json_response(['success' => false, 'error' => 'Invalid page'], 400);
}

try {
    $db = migewlito_get_db();

    // Fetch Game Status
    $stmt = $db->prepare("SELECT * FROM games_status WHERE page = ?");
    $stmt->execute([$page]);
    $g = $stmt->fetch() ?: [];

    // Fetch Overrides
    $stmt = $db->prepare("SELECT * FROM catalog_overrides WHERE page = ?");
    $stmt->execute([$page]);
    $o = $stmt->fetch() ?: [];
    
    $products = [];
    if (!empty($o['products'])) {
        $products = json_decode($o['products'], true);
        if (!is_array($products)) $products = [];
    }

    migewlito_json_response([
        'success' => true,
        'page' => $page,
        'maintenance' => (bool)($g['maintenance'] ?? false),
        'message' => (string)($g['message'] ?? ''),
        'products' => $products,
    ]);

} catch (Exception $e) {
    migewlito_json_response([
        'success' => true,
        'page' => $page,
        'maintenance' => false,
        'message' => '',
        'products' => [],
    ]);
}
