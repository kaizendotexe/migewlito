<?php
$content = file_get_contents('gogogo.com/en-ph/assets/css/app-style.css');
$lines = explode("\n", $content);
$line6045 = $lines[6044]; // 0-indexed, so 6044 is line 6045

echo "Length: " . strlen($line6045) . "\n";

// Find img rules
if (preg_match_all('/img\s*{[^}]*}/', $line6045, $matches)) {
    echo "Found img rules:\n";
    print_r($matches[0]);
}

// Find rounded rules
if (preg_match_all('/\.rounded\s*{[^}]*}/', $line6045, $matches)) {
    echo "Found .rounded rules:\n";
    print_r($matches[0]);
}

// Find navbar rules
if (preg_match_all('/\.navbar[^}]*{[^}]*}/', $line6045, $matches)) {
    echo "Found .navbar rules:\n";
    print_r($matches[0]);
}

// Find pulse usage
if (preg_match_all('/[^{]*pulse[^{]*{[^}]*}/', $line6045, $matches)) {
    echo "Found pulse usage:\n";
    print_r($matches[0]);
}

// Find keyframes usage
if (preg_match_all('/animation:[^;}]*pulse/', $line6045, $matches)) {
    echo "Found animation pulse:\n";
    print_r($matches[0]);
}
?>