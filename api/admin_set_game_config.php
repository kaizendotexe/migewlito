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

// Prepare incoming products map
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

try {
    $db = migewlito_get_db();

    // 1. Update Games Status
    $stmt = $db->prepare("SELECT page FROM games_status WHERE page = ?");
    $stmt->execute([$page]);
    if ($stmt->fetch()) {
        $upd = $db->prepare("UPDATE games_status SET maintenance = ?, message = ?, updated_at = ? WHERE page = ?");
        $upd->execute([$maintenance ? 1 : 0, $message, gmdate('Y-m-d H:i:s'), $page]);
    } else {
        $ins = $db->prepare("INSERT INTO games_status (page, maintenance, message, updated_at) VALUES (?, ?, ?, ?)");
        $ins->execute([$page, $maintenance ? 1 : 0, $message, gmdate('Y-m-d H:i:s')]);
    }

    // 2. Update Catalog Overrides
    $stmt = $db->prepare("SELECT products FROM catalog_overrides WHERE page = ?");
    $stmt->execute([$page]);
    $row = $stmt->fetch();
    
    $existingProducts = [];
    if ($row && !empty($row['products'])) {
        $existingProducts = json_decode($row['products'], true);
        if (!is_array($existingProducts)) $existingProducts = [];
    }

    foreach ($incomingProducts as $pid => $data) {
        $allEmpty = ($data['price'] === null) && ($data['discount_price'] === null) && ($data['off_text'] === '') && ($data['hidden'] === false) && ($data['name'] === '') && ($data['subname'] === '') && ($data['image_url'] === '');
        if ($allEmpty) {
            unset($existingProducts[$pid]);
            continue;
        }
        $existingProducts[$pid] = $data;
    }

    $jsonProducts = json_encode($existingProducts, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    if ($row) {
        $upd = $db->prepare("UPDATE catalog_overrides SET products = ?, updated_at = ? WHERE page = ?");
        $upd->execute([$jsonProducts, gmdate('Y-m-d H:i:s'), $page]);
    } else {
        $ins = $db->prepare("INSERT INTO catalog_overrides (page, products, updated_at) VALUES (?, ?, ?)");
        $ins->execute([$page, $jsonProducts, gmdate('Y-m-d H:i:s')]);
    }

    migewlito_json_response(['success' => true]);

} catch (Exception $e) {
    migewlito_json_response(['success' => false, 'error' => 'Database error: ' . $e->getMessage()], 500);
}
