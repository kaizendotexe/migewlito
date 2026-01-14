<?php
declare(strict_types=1);
require_once __DIR__ . '/_helpers.php';

migewlito_require_method('POST');
migewlito_start_session();

$body = migewlito_read_body();
$identifier = trim((string)($body['identifier'] ?? ($body['email'] ?? '')));
$email = strtolower(trim($identifier));
$username = strtolower(trim($identifier));
$password = (string)($body['password'] ?? '');

if (!$identifier || !$password) {
    migewlito_json_response(['success' => false, 'error' => 'Username/email and password required'], 400);
}

try {
    $db = migewlito_get_db();

    // Find user by email OR username
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ? OR username = ?");
    $stmt->execute([$email, $username]);
    $found = $stmt->fetch();

    if (!$found) {
        migewlito_json_response(['success' => false, 'error' => 'Invalid credentials'], 401);
    }
    if (!password_verify($password, (string)($found['password_hash'] ?? ''))) {
        migewlito_json_response(['success' => false, 'error' => 'Invalid credentials'], 401);
    }

    // Auto-promote to admin if in list (legacy feature support)
    $adminEmails = ['admin@gmail.com'];
    if (in_array(strtolower((string)($found['email'] ?? '')), $adminEmails, true) && strtolower((string)($found['role'] ?? 'member')) !== 'admin') {
        $upd = $db->prepare("UPDATE users SET role = 'admin' WHERE id = ?");
        $upd->execute([$found['id']]);
        $found['role'] = 'admin';
    }

    $_SESSION['user_id'] = (string)($found['id'] ?? '');
    migewlito_json_response(['success' => true, 'user' => migewlito_public_user($found)]);

} catch (Exception $e) {
    migewlito_json_response(['success' => false, 'error' => 'Database error'], 500);
}
