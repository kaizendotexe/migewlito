<?php
ini_set('memory_limit', '512M');
$file = "c:/xampp/htdocs/migewlito's/gogogo.com/en-ph/assets/css/app-style.css";
$handle = fopen($file, "r");
if ($handle) {
    $lineCount = 0;
    while (($line = fgets($handle)) !== false) {
        $lineCount++;
        if ($lineCount == 6045) {
            echo "Line 6045 length: " . strlen($line) . "\n";
            echo "First 500 chars: " . substr($line, 0, 500) . "\n";
            
            $offset = 0;
            $count = 0;
            while (($pos = stripos($line, 'navbar', $offset)) !== false) {
                echo "Match at $pos: " . substr($line, max(0, $pos - 20), 60) . "\n";
                $offset = $pos + 1;
                $count++;
                if ($count > 20) {
                    echo "Showing first 20 matches only...\n";
                    break;
                }
            }
            if ($count == 0) {
                echo "'navbar' not found in line 6045.\n";
            }
            break;
        }
    }
    fclose($handle);
} else {
    echo "Error opening file.\n";
}
?>
