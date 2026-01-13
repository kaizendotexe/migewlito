<?php
ini_set('memory_limit', '512M');
$file = "c:/xampp/htdocs/migewlito's/gogogo.com/en-ph/assets/css/app-style.css";
$lines = file($file); // Keep newlines
foreach ($lines as $i => $line) {
    if (strpos($line, ':root') !== false) {
        echo "Line " . ($i+1) . " starts with :root\n";
        echo "First 100 chars: " . substr($line, 0, 100) . "\n";
        if (strpos($line, '--navbar_background') !== false) {
             echo "CONTAINS --navbar_background\n";
        } else {
             echo "DOES NOT CONTAIN --navbar_background\n";
        }
    }
}
?>
