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

$lines = explode("\n", $content);
$lineIndex = 6044; // Line 6045 is index 6044

if (isset($lines[$lineIndex])) {
    $line = $lines[$lineIndex];
    $originalLine = $line;

    // 1. Remove --navbar_background variable
    // It is likely inside :root{...}
    $line = str_replace('--navbar_background:#3A0069;', '', $line);
    $line = str_replace('--navbar_background:#3A0069', '', $line); 

    // 2. Remove .navbar and body rules
    // We assume the line is a series of CSS rules minified
    $rules = explode('}', $line);
    $newRules = [];
    $removedCount = 0;

    foreach ($rules as $rule) {
        if (trim($rule) === '') continue;

        // Check if rule selector contains .navbar or .navbar-brand or header
        $parts = explode('{', $rule);
        if (count($parts) >= 2) {
            $selector = $parts[0];
            $body = isset($parts[1]) ? $parts[1] : '';

            // Aggressive removal of nav related styles from this added block
            if (strpos($selector, '.navbar') !== false ||
                strpos($selector, '.nav-') !== false ||
                strpos($selector, 'header') !== false ||
                (strpos($selector, 'body') !== false && strpos($body, 'background') !== false) 
               ) {
                echo "Removing rule: " . substr($rule, 0, 50) . "...}\n";
                $removedCount++;
                continue; // Skip this rule
            }
        }
        
        $newRules[] = $rule;
    }

    $newLine = implode('}', $newRules);
    // If the original line ended with '}', we ensure the new one does too if it's not empty
    if (trim($newLine) !== '' && substr(trim($originalLine), -1) === '}') {
        $newLine .= '}';
    }

    if ($newLine !== $originalLine) {
        $lines[$lineIndex] = $newLine;
        file_put_contents($file, implode("\n", $lines));
        echo "Successfully removed $removedCount rules and cleaned variables.\n";
    } else {
        echo "No changes made.\n";
    }

} else {
    echo "Line 6045 not found.\n";
}
?>
