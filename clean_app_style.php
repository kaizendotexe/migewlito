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

// Find the start of JasTopUp styles
$jasStartMarker = "/* JAS TOP UP STYLES */";
$jasStartPos = strpos($content, $jasStartMarker);

if ($jasStartPos === false) {
    die("JasTopUp styles marker not found.\n");
}

$preJasContent = substr($content, 0, $jasStartPos);
$jasContent = substr($content, $jasStartPos);

// Selectors to blacklist in the JasTopUp section
$blacklist = [
    '.navbar',
    '.nav-item',
    '.nav-link',
    '.navbar-brand',
    '.navbar-collapse',
    '.navbar-toggler',
    '.searchnav',
    'body',
    'html',
    'header'
];

// Split JasTopUp content into lines
$lines = explode("\n", $jasContent);
$cleanedLines = [];

foreach ($lines as $line) {
    // If line is empty or just comments, keep it
    if (trim($line) === '' || strpos(trim($line), '/*') === 0) {
        $cleanedLines[] = $line;
        continue;
    }

    // Split line into rules by '}'
    // Note: This is a simple parser and might break on '}' inside strings/content, but for this CSS it should be fine.
    $rules = explode('}', $line);
    $cleanedRules = [];

    foreach ($rules as $rule) {
        $trimRule = trim($rule);
        if ($trimRule === '') continue;

        // Check if rule contains any blacklisted selector
        // We look at the part before '{'
        $parts = explode('{', $trimRule, 2);
        if (count($parts) < 2) {
            // Might be a closing brace remnant or something, just keep it if it's not a rule
            // But since we exploded by '}', we lost the '}'. We need to append it back if we keep the rule.
            $cleanedRules[] = $rule; 
            continue;
        }

        $selector = $parts[0];
        $isBlacklisted = false;
        foreach ($blacklist as $bad) {
            // Check if selector contains the blacklisted term
            // We use word boundary check or just strpos if we are confident
            // Given minified CSS, '.navbar' might be part of '.navbar-something'. 
            // The blacklist includes '.navbar', which matches '.navbar', '.navbar-brand', etc.
            // But we must be careful not to match '.card-navbar' if that existed (unlikely).
            // For now, strict strpos check is probably what we want because we want to ban ANY modification to navbar components from this section.
            
            // However, we MUST NOT remove variable definitions in :root
            if (strpos($selector, ':root') !== false) {
                // Keep :root, but we might want to filter variables inside it?
                // The previous turn showed variables are in :root. 
                // We decided to keep variables as they might be used by game cards.
                continue; 
            }

            if (strpos($selector, $bad) !== false) {
                $isBlacklisted = true;
                // echo "Removing rule: " . substr($trimRule, 0, 50) . "...\n";
                break;
            }
        }

        if (!$isBlacklisted) {
            $cleanedRules[] = $rule;
        }
    }

    // Reconstruct the line
    if (!empty($cleanedRules)) {
        // Implode with '}' and add the last '}' that was lost in explode
        // Wait, if the line ended with '}', explode gives an empty element at the end.
        // If we exploded "rule1}rule2}", we get ["rule1", "rule2", ""].
        // We processed "rule1" and "rule2".
        // We need to join them back with "}" and append "}" at the end if the original line had it?
        // Actually, better to just join with "}" and add a closing "}" for each rule.
        
        $newLine = "";
        foreach ($cleanedRules as $r) {
            // Check if it's just whitespace
            if (trim($r) === '') continue;
            
            // If it's a valid rule part (has selector and body), append '}'
            // If it was a comment or something without '}', careful.
            // But we assumed structure "selector{body}".
            
            // Simple reconstruction:
            $newLine .= $r . "}";
        }
        $cleanedLines[] = $newLine;
    } else {
        // If all rules were removed, adding an empty line or nothing is fine.
        // $cleanedLines[] = ""; 
    }
}

// Reassemble content
$newContent = $preJasContent . implode("\n", $cleanedLines);

// Write back
if (file_put_contents($file, $newContent)) {
    echo "Successfully cleaned app-style.css\n";
} else {
    echo "Failed to write to file.\n";
}
?>
