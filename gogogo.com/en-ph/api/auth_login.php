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

$users = migewlito_get_users();
$found = null;
$foundIndex = -1;
foreach ($users as $u) {
    $foundIndex++;
    $uEmail = strtolower((string)($u['email'] ?? ''));
    $uUser = strtolower((string)($u['username'] ?? ''));
    if ($uEmail === $email || ($username && $uUser === $username)) {
        $found = $u;
        break;
    }
}
if (!$found) {
    migewlito_json_response(['success' => false, 'error' => 'Invalid credentials'], 401);
}
if (!password_verify($password, (string)($found['password_hash'] ?? ''))) {
    migewlito_json_response(['success' => false, 'error' => 'Invalid credentials'], 401);
}

$adminEmails = ['admin@gmail.com'];
if (in_array(strtolower((string)($found['email'] ?? '')), $adminEmails, true) && strtolower((string)($found['role'] ?? 'member')) !== 'admin') {
    $users = migewlito_get_users();
    foreach ($users as $i => $u2) {
        if (strtolower((string)($u2['email'] ?? '')) === strtolower((string)($found['email'] ?? ''))) {
            $users[$i]['role'] = 'admin';
            $found['role'] = 'admin';
            migewlito_save_users($users);
            break;
        }
    }
}

$_SESSION['user_id'] = (string)($found['id'] ?? '');
migewlito_json_response(['success' => true, 'user' => migewlito_public_user($found)]);
