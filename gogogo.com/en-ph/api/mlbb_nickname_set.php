<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'method_not_allowed',
    ]);
    exit;
}

$userId = isset($_POST['user_id']) ? trim((string)$_POST['user_id']) : '';
$zoneId = isset($_POST['zone_id']) ? trim((string)$_POST['zone_id']) : '';
$nickname = isset($_POST['nickname']) ? trim((string)$_POST['nickname']) : '';

if ($userId === '' || $zoneId === '' || $nickname === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'missing_params',
        'message' => 'user_id, zone_id, and nickname are required',
    ]);
    exit;
}

if (strlen($userId) > 32 || strlen($zoneId) > 32 || strlen($nickname) > 64) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'invalid_params',
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
$map[$key] = $nickname;

$encoded = json_encode($map, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
if ($encoded === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'encode_failed',
    ]);
    exit;
}

$ok = @file_put_contents($mapFile, $encoded . "\n", LOCK_EX);
if ($ok === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'write_failed',
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'user_id' => $userId,
    'zone_id' => $zoneId,
    'nickname' => $nickname,
]);

