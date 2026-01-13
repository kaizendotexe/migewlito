<?php
$file = "c:/xampp/htdocs/migewlito's/gogogo.com/en-ph/assets/css/app-style.css";
$content = file_get_contents($file);
$lines = explode("\n", $content);

$variable = '--navbar_background';
$found_lines = [];

foreach ($lines as $i => $line) {
    if (strpos($line, $variable) !== false) {
        $found_lines[] = $i + 1;
    }
}

echo "Variable $variable found in lines: " . implode(", ", $found_lines) . "\n";

if (count($found_lines) == 1 && $found_lines[0] == 6045) {
    echo "Variable is ONLY in the JasTopUp extracted line. Safe to remove if not needed by game cards.\n";
} else {
    echo "Variable is used elsewhere!\n";
}
?>
