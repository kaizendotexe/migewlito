<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$file = "c:/xampp/htdocs/migewlito's/gogogo.com/en-ph/assets/css/app-style.css";

if (!file_exists($file)) {
    die("File not found: $file\n");
}

$content = file_get_contents($file);
if ($content === false) {
    die("Could not read file: $file\n");
}

// Find start of JasTopUp
$jasStartMarker = "/* JAS TOP UP STYLES */";
$jasStartPos = strpos($content, $jasStartMarker);

if ($jasStartPos === false) {
    die("JasTopUp styles marker not found.\n");
}

$preJas = substr($content, 0, $jasStartPos);
$jasContent = substr($content, $jasStartPos);

// List of regex patterns to remove
$patterns = [
    '/\.searchnav\s*\{[^}]+\}/',
    '/\.searchnav:hover\s*\{[^}]+\}/',
    '/\.searchnav\s+svg\s*\{[^}]+\}/',
    '/\.searchnav:hover\s+svg\s*\{[^}]+\}/',
    '/\.navbar-collapse\s*\{[^}]+\}/',
    '/\.navbar-dark\s+\.navbar-toggler\s*\{[^}]+\}/',
    '/\.navbar-dark\s+\.navbar-toggler\s+svg\s*\{[^}]+\}/',
    '/a\.nav-item\s*\{[^}]+\}/',
    '/a\.nav-item:hover,a\.nav-item\.active\s*\{[^}]+\}/',
    '/a\.nav-item\s+\.nav-icon\s*\{[^}]+\}/',
    '/\.nav-ttile\s*\{[^}]+\}/',
    '/a\.nav-item\s+\.nav-ttile\s*\{[^}]+\}/',
    '/a\.nav-item:hover\s+\.nav-ttile\s*\{[^}]+\}/',
    '/\.navbar\s*\{[^}]+\}/',
    '/\.navbar-brand\s*\{[^}]+\}/',
    '/\.navbar-brand\s+img\s*\{[^}]+\}/',
    '/\.navbar-brand::after\s*\{[^}]+\}/'
];

foreach ($patterns as $pattern) {
    $count = 0;
    $jasContent = preg_replace($pattern, '', $jasContent, -1, $count);
    if ($count > 0) {
        echo "Removed $count matches for pattern: $pattern\n";
    }
}

// Write back
$newContent = $preJas . $jasContent;
if (file_put_contents($file, $newContent)) {
    echo "Successfully force cleaned app-style.css\n";
} else {
    echo "Failed to write file.\n";
}
?>
