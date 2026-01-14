<?php
declare(strict_types=1);
require_once __DIR__ . '/_helpers.php';

migewlito_require_admin();

$gamesDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'games';
$list = [];
if (is_dir($gamesDir)) {
    $files = glob($gamesDir . DIRECTORY_SEPARATOR . '*.html') ?: [];
    foreach ($files as $f) {
        $base = basename($f);
        $list[] = 'games/' . $base;
    }
}
sort($list);
migewlito_json_response(['success' => true, 'games' => $list]);

