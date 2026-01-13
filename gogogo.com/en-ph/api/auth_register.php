<?php
declare(strict_types=1);
require_once __DIR__ . '/_helpers.php';

migewlito_require_method('POST');
migewlito_start_session();

$body = migewlito_read_body();
$email = strtolower(trim((string)($body['email'] ?? '')));
$password = (string)($body['password'] ?? '');
$name = trim((string)($body['name'] ?? ''));
$username = trim((string)($body['username'] ?? ''));

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    migewlito_json_response(['success' => false, 'error' => 'Invalid email'], 400);
}
if (strlen($password) < 6) {
    migewlito_json_response(['success' => false, 'error' => 'Password must be at least 6 characters'], 400);
}
if (!$name) $name = $email;

$usernameNorm = '';
if ($username !== '') {
    $usernameNorm = strtolower($username);
    if (!preg_match('/^[a-zA-Z0-9_.-]{3,24}$/', $username)) {
        migewlito_json_response(['success' => false, 'error' => 'Username must be 3-24 chars (letters, numbers, _ . -)'], 400);
    }
}

$users = migewlito_get_users();
foreach ($users as $u) {
    if (strtolower((string)($u['email'] ?? '')) === $email) {
        migewlito_json_response(['success' => false, 'error' => 'Email already registered'], 409);
    }
    if ($usernameNorm && strtolower((string)($u['username'] ?? '')) === $usernameNorm) {
        migewlito_json_response(['success' => false, 'error' => 'Username already taken'], 409);
    }
}

$isFirstUser = count($users) === 0;
$adminEmails = ['admin@gmail.com'];
$isAdminEmail = in_array($email, $adminEmails, true);
$role = ($isFirstUser || $isAdminEmail) ? 'admin' : 'member';
$id = 'u_' . bin2hex(random_bytes(10));
$hash = password_hash($password, PASSWORD_DEFAULT);
$avatar = '';

$users[] = [
    'id' => $id,
    'email' => $email,
    'username' => $usernameNorm,
    'name' => $name,
    'role' => $role,
    'password_hash' => $hash,
    'avatar_url' => $avatar,
    'created_at' => gmdate('c'),
];

if (!migewlito_save_users($users)) {
    migewlito_json_response(['success' => false, 'error' => 'Failed to save user'], 500);
}

$_SESSION['user_id'] = $id;
migewlito_json_response(['success' => true, 'user' => migewlito_public_user(end($users))]);
