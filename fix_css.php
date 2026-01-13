<?php
$file = 'gogogo.com/en-ph/assets/css/app-style.css';
$content = file_get_contents($file);
$lines = explode("\n", $content);
$lineIndex = 6044; // Line 6045 is index 6044

if (isset($lines[$lineIndex])) {
    $line = $lines[$lineIndex];
    
    // Rules to remove
    $patterns = [
        '/img\{width:50px;height:auto;object-fit:contain;display:block\}/',
        '/\.navbar\{backdrop-filter:blur\(10px\);--webkit-backdrop-filter:blur\(10px\);background:rgba\(58,0,105,0.8\);padding:15px 1rem\}/',
        '/\.navbar-brand img\{width:50px;height:auto;object-fit:contain;display:block\}/',
        '/\.navbar-brand\{position:relative;display:inline-block;overflow:hidden\}/',
        '/\.navbar-brand::after\{content:"";position:absolute;top:0;left:-75%;width:50%;height:100%;background:linear-gradient\(120deg,transparent,rgba\(255,255,255,0.5\),transparent\);animation:shimmer 6s infinite\}/'
    ];
    
    $newLine = $line;
    foreach ($patterns as $pattern) {
        $newLine = preg_replace($pattern, '', $newLine);
    }
    
    if ($newLine !== $line) {
        $lines[$lineIndex] = $newLine;
        file_put_contents($file, implode("\n", $lines));
        echo "Successfully removed conflicting CSS rules.\n";
    } else {
        echo "No matching rules found to remove.\n";
    }
} else {
    echo "Line 6045 not found.\n";
}
?>