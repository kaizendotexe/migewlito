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
    
    $toRemove = [
        '.navbar{backdrop-filter:blur(10px);--webkit-backdrop-filter:blur(10px);background:rgba(58,0,105,0.8);padding:15px 1rem}',
        '.navbar-brand img{width:50px;height:auto;object-fit:contain;display:block}',
        '.navbar-brand{position:relative;display:inline-block;overflow:hidden}',
        '.navbar-brand::after{content:"";position:absolute;top:0;left:-75%;width:50%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,0.5),transparent);animation:shimmer 6s infinite}',
        'body,html{font-family:"Poppins",sans-serif;font-optical-sizing:auto;font-weight:500!important;font-style:normal;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;letter-spacing:0px}',
        'body{background:var(--body_background);background-repeat:no-repeat;background-attachment:fixed}'
    ];
    
    $originalLine = $line;
    foreach ($toRemove as $search) {
        $line = str_replace($search, '', $line);
    }
    
    if ($line !== $originalLine) {
        $lines[$lineIndex] = $line;
        file_put_contents($file, implode("\n", $lines));
        echo "Successfully removed conflicting CSS rules using str_replace.\n";
    } else {
        echo "No strings matched for removal.\n";
        // Debugging: print what we are looking for vs what is there
        echo "Looking for: " . $toRemove[0] . "\n";
        echo "In line (substr): " . substr($originalLine, 0, 100) . "...\n";
    }
} else {
    echo "Line 6045 not found.\n";
}
?>
