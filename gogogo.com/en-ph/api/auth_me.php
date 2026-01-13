<?php
declare(strict_types=1);
require_once __DIR__ . '/_helpers.php';

migewlito_start_session();
$u = migewlito_get_current_user();
if (!$u) {
    migewlito_json_response(['success' => true, 'user' => null]);
}
migewlito_json_response(['success' => true, 'user' => migewlito_public_user($u)]);

