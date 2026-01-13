<?php
$file = "c:/xampp/htdocs/migewlito's/gogogo.com/en-ph/assets/css/app-style.css";
$content = file_get_contents($file);
$lines = explode("\n", $content);
$lineIndex = 6044; // Line 6045

if (isset($lines[$lineIndex])) {
    $line = $lines[$lineIndex];
    // The line is likely minified or concatenated.
    // Let's try to split by '}' to get rules.
    $rules = explode('}', $line);

    $selectors_to_watch = ['.nav', 'header', 'logo', 'menu', 'dropdown', 'toggler'];

    echo "Checking for remaining navbar-related styles in line 6045:\n";
    $found = false;
    foreach ($rules as $rule) {
        $rule = trim($rule);
        if (empty($rule)) continue;
        
        // The selector is usually before the '{'
        $parts = explode('{', $rule);
        if (count($parts) >= 1) {
            $selector = trim($parts[0]);
            
            foreach ($selectors_to_watch as $watch) {
                if (stripos($selector, $watch) !== false) {
                    // Exclude :root variables if they just contain the word 'nav' (unlikely in selector, but possible in value if not parsed correctly)
                    // Actually, if it's :root, the selector is :root.
                    if ($selector === ':root') continue;

                    echo "FOUND POTENTIAL CONFLICT: " . $rule . "}\n";
                    $found = true;
                    break; 
                }
            }
        }
    }
    if (!$found) {
        echo "No obvious navbar selector conflicts found in line 6045.\n";
    }

} else {
    echo "Line 6045 not found.\n";
}
?>
