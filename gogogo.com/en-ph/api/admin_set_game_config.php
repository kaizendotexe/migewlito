<?php
declare(strict_types=1);
require_once __DIR__ . '/_helpers.php';

migewlito_require_method('POST');
migewlito_require_admin();

$body = migewlito_read_body();
$page = migewlito_sanitize_game_page((string)($body['page'] ?? ''));
if (!$page) {
    migewlito_json_response(['success' => false, 'error' => 'Invalid page'], 400);
}

$maintenance = (bool)($body['maintenance'] ?? false);
$message = trim((string)($body['message'] ?? ''));
$products = $body['products'] ?? [];
if (!is_array($products)) $products = [];

$incomingProducts = [];
foreach ($products as $pid => $row) {
    $k = preg_replace('/[^0-9]/', '', (string)$pid) ?? '';
    if (!$k) continue;
    if (!is_array($row)) continue;
    $price = (isset($row['price']) && trim((string)$row['price']) !== '') ? (float)$row['price'] : null;
    $discount_price = (isset($row['discount_price']) && trim((string)$row['discount_price']) !== '') ? (float)$row['discount_price'] : null;
    $off_text = isset($row['off_text']) ? trim((string)$row['off_text']) : '';
    $hidden = (bool)($row['hidden'] ?? false);
    $name = isset($row['name']) ? trim((string)$row['name']) : '';
    $subname = isset($row['subname']) ? trim((string)$row['subname']) : '';
    $image_url = isset($row['image_url']) ? trim((string)$row['image_url']) : '';
    if ($image_url && !preg_match('#^(https?://|/|\\.{0,2}/)#i', $image_url)) {
        $image_url = '';
    }
    $incomingProducts[$k] = [
        'price' => $price,
        'discount_price' => $discount_price,
        'off_text' => $off_text,
        'hidden' => $hidden,
        'name' => $name,
        'subname' => $subname,
        'image_url' => $image_url,
    ];
}

$games = migewlito_read_json_file(migewlito_games_status_path(), []);
$games[$page] = [
    'maintenance' => $maintenance,
    'message' => $message,
    'updated_at' => gmdate('c'),
];
migewlito_write_json_file(migewlito_games_status_path(), $games);

$overrides = migewlito_read_json_file(migewlito_catalog_overrides_path(), []);
$existing = is_array($overrides[$page] ?? null) ? $overrides[$page] : [];
$existingProducts = is_array($existing['products'] ?? null) ? $existing['products'] : [];

foreach ($incomingProducts as $pid => $row) {
    $allEmpty = ($row['price'] === null) && ($row['discount_price'] === null) && ($row['off_text'] === '') && ($row['hidden'] === false) && ($row['name'] === '') && ($row['subname'] === '') && ($row['image_url'] === '');
    if ($allEmpty) {
        unset($existingProducts[$pid]);
        continue;
    }
    $existingProducts[$pid] = $row;
}

$overrides[$page] = [
    'products' => $existingProducts,
    'updated_at' => gmdate('c'),
];
migewlito_write_json_file(migewlito_catalog_overrides_path(), $overrides);

migewlito_json_response(['success' => true]);
