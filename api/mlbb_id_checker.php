<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$userId = isset($_GET['user_id']) ? trim((string)$_GET['user_id']) : '';
$zoneId = isset($_GET['zone_id']) ? trim((string)$_GET['zone_id']) : '';

if ($userId === '' || $zoneId === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'missing_params',
        'message' => 'user_id and zone_id are required',
    ]);
    exit;
}

$mapFile = __DIR__ . DIRECTORY_SEPARATOR . 'mlbb_nicknames.json';
$map = [];
if (is_file($mapFile)) {
    $raw = file_get_contents($mapFile);
    $decoded = json_decode($raw ?: '[]', true);
    if (is_array($decoded)) {
        $map = $decoded;
    }
}

$key = $userId . ':' . $zoneId;
$nickname = '';
 $found = false;
if (isset($map[$key]) && is_string($map[$key])) {
    $nickname = trim($map[$key]);
    $found = ($nickname !== '');
}

echo json_encode([
    'success' => true,
    'user_id' => $userId,
    'zone_id' => $zoneId,
    'nickname' => $nickname,
    'found' => $found,
]);
