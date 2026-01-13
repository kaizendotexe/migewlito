<?php
$file = "c:/xampp/htdocs/migewlito's/gogogo.com/en-ph/assets/css/app-style.css";
$content = file_get_contents($file);
$lines = explode("\n", $content);
$lineIndex = 6044; // Line 6045

if (isset($lines[$lineIndex])) {
    $line = $lines[$lineIndex];
    $rules = explode('}', $line);
    
    echo "Scanning for nav related rules in JasTopUp CSS:\n";
    foreach ($rules as $rule) {
        // Look for selectors
        $parts = explode('{', $rule);
        if (count($parts) > 0) {
            $selector = trim($parts[0]);
            if (strpos($selector, '.nav') !== false || strpos($selector, 'nav') === 0 || strpos($selector, 'header') !== false) {
                 // Check if it's one of the ones I already removed or something new
                 echo $rule . "}\n";
            }
        }
    }
}
?>
