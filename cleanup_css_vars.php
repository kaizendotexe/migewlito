<?php
ini_set('memory_limit', '512M');
$file = "c:/xampp/htdocs/migewlito's/gogogo.com/en-ph/assets/css/app-style.css";

if (!file_exists($file)) {
    die("File not found: $file\n");
}

// Use file() to read into array, handling newlines automatically
$lines = file($file, FILE_IGNORE_NEW_LINES);

$found = false;
foreach ($lines as $i => $line) {
    // Check for --navbar_background
    if (strpos($line, '--navbar_background') !== false) {
        echo "Found '--navbar_background' in line " . ($i + 1) . "\n";
        
        // Remove it
        // Capture everything up to semicolon
        $newLine = preg_replace('/--navbar_background\s*:[^;]+;/', '', $line);
        
        if ($newLine !== $line) {
            $lines[$i] = $newLine;
            $found = true;
            echo "Removed variable from line " . ($i + 1) . "\n";
        } else {
             echo "Regex failed to remove variable.\n";
        }
    }
}

if ($found) {
    file_put_contents($file, implode("\n", $lines));
    echo "File updated successfully.\n";
} else {
    echo "Variable '--navbar_background' NOT found in any line.\n";
}
?>
