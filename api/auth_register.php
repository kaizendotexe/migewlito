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

try {
    $db = migewlito_get_db();

    // Check if email or username exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ? OR (username != '' AND username = ?)");
    $stmt->execute([$email, $usernameNorm]);
    if ($stmt->fetch()) {
        migewlito_json_response(['success' => false, 'error' => 'Email or Username already registered'], 409);
    }

    // Determine Role
    // Check if this is the first user
    $stmt = $db->query("SELECT count(*) as c FROM users");
    $count = $stmt->fetchColumn();
    $isFirstUser = ($count == 0);

    $adminEmails = ['admin@gmail.com'];
    $isAdminEmail = in_array($email, $adminEmails, true);
    $role = ($isFirstUser || $isAdminEmail) ? 'admin' : 'member';

    $id = 'u_' . bin2hex(random_bytes(10));
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $avatar = '';

    $stmt = $db->prepare("INSERT INTO users (id, email, username, name, password_hash, role, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $id,
        $email,
        $usernameNorm,
        $name,
        $hash,
        $role,
        $avatar,
        gmdate('Y-m-d H:i:s')
    ]);

    $_SESSION['user_id'] = $id;
    
    // Fetch back the user to return clean object
    $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $newUser = $stmt->fetch();

    migewlito_json_response(['success' => true, 'user' => migewlito_public_user($newUser)]);

} catch (Exception $e) {
    migewlito_json_response(['success' => false, 'error' => 'Database error: ' . $e->getMessage()], 500);
}
