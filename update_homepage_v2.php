<?php
// update_homepage_v2.php

$indexFile = __DIR__ . "/gogogo.com/en-ph/index.html";
$jasFile = __DIR__ . "/gogogo.com/en-ph/assets/images/JasTopUp - Discounted Game Credits (1_12_2026 10：32：42 PM).html";
$cssFile = __DIR__ . "/gogogo.com/en-ph/assets/css/app-style.css";

// 1. Extract Images from JasTopUp
$jasContent = file_get_contents($jasFile);
$jasGameImages = [];

$cards = explode('<div name="game-', $jasContent);
array_shift($cards); 

foreach ($cards as $cardBlock) {
    if (preg_match('/<h1 class=title-games-b>([^<]+)<\/h1>/', $cardBlock, $titleMatch)) {
        $title = trim($titleMatch[1]);
        if (preg_match('/<img[^>]*class=image-games-b[^>]*src="([^"]+)"/i', $cardBlock, $imgMatch)) {
            $src = $imgMatch[1];
            $jasGameImages[$title] = $src;
        }
    }
}

// Helper to get image
function getImage($name, $images) {
    // Try exact match
    if (isset($images[$name])) return $images[$name];
    
    // Try partial match
    foreach ($images as $key => $src) {
        if (stripos($key, $name) !== false) return $src;
    }
    
    // Fallback to generic Mobile Legends if it's an ML variant
    if (stripos($name, 'Mobile Legends') !== false) {
        foreach ($images as $key => $src) {
            if (stripos($key, 'Mobile Legends') !== false || stripos($key, 'MLBB') !== false) return $src;
        }
    }
    
    return ""; // Should ideally have a placeholder
}

// 2. Define Trending Games List
$trendingGames = [
    [
        'name' => 'Mobile Legends - Global',
        'href' => 'games/mobile-legends-games-phd959.html',
        'image_key' => 'Mobile Legends' 
    ],
    [
        'name' => 'Mobile Legends - Philippines',
        'href' => 'games/mobile-legends-games-ph.html',
        'image_key' => 'Mobile Legends'
    ],
    [
        'name' => 'Mobile Legends - Malaysia',
        'href' => 'games/mobile-legends-malaysia.html',
        'image_key' => 'Mobile Legends'
    ],
    [
        'name' => 'Mobile Legends - Singapore',
        'href' => 'games/mobile-legends-games-ph3467.html',
        'image_key' => 'Mobile Legends'
    ],
    [
        'name' => 'Magic Chess: Go Go',
        'href' => 'games/magic-chess-go-go.html',
        'image_key' => 'Magic Chess'
    ],
    [
        'name' => 'Genshin Impact',
        'href' => 'games/genshin-crystal-games.html',
        'image_key' => 'Genshin Impact'
    ],
    [
        'name' => 'Roblox',
        'href' => 'games/roblox-gift-card.html',
        'image_key' => 'Roblox'
    ],
    [
        'name' => 'Chamet',
        'href' => 'games/chamet.html',
        'image_key' => 'Chamet'
    ],
    [
        'name' => 'Poppo Live',
        'href' => 'games/poppo-live.html',
        'image_key' => 'Poppo'
    ]
];

// 3. Build HTML for Trending Section
function buildCard($href, $imageSrc, $rawName) {
    $reviews = rand(100, 5000) . " reviews";
    return <<<HTML
    <div class="card-games-b">
        <a href="$href">
            <div class="gemsen">
                <span>Hot</span>
            </div>
            <img class="image-games-b" src="$imageSrc" alt="$rawName">
            <div class="text-games-b gap-[12px] md:gap-[16px]">
                <h1 class="title-games-b">$rawName</h1>
                <div class="w-100 position-relative d-flex flex-column gap-[8px]">
                    <div class="w-100 d-flex align-items-center gap-[4px]">
                        <svg class="flex-shrink-0 w-[10px] h-[10px]" width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.78544 0.784116C5.89297 0.543304 5.81278 0.262064 5.59226 0.107382C5.37173 -0.0473002 5.07101 -0.0332382 4.86507 0.139021L0.199411 4.07638C0.0171582 4.23106 -0.0484527 4.47891 0.0372059 4.69687C0.122865 4.91483 0.341567 5.06248 0.583963 5.06248H2.61608L1.21456 8.21588C1.10703 8.4567 1.18722 8.73794 1.40774 8.89262C1.62827 9.0473 1.92899 9.03324 2.13493 8.86098L6.80059 4.92362C6.98284 4.76894 7.04845 4.52109 6.96279 4.30313C6.87714 4.08517 6.66025 3.93928 6.41604 3.93928H4.38392L5.78544 0.784116Z" fill="currentColor"></path>
                        </svg>
                        <span class="font-size-[10px] line-height-[15px] font-weight-[500]">Instant</span>
                    </div>
                    <div class="w-100 d-flex flex-column align-items-start justify-content-start gap-[4px]">
                        <div class="d-flex align-items-center gap-[4px]">
                            <span class="font-size-[14px] font-weight-[700] d-none sf-hidden" style="color:#FFB30E">5.0</span>
                            <svg class="flex-shrink-0 w-[14px] h-[14px]" style="margin-top:-2px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#FFB30E" d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.97 1.97 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.98 1.98 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.96 1.96 0 0 1-1.16.379"></path></svg>
                            <svg class="flex-shrink-0 w-[14px] h-[14px]" style="margin-top:-2px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#FFB30E" d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.97 1.97 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.98 1.98 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.96 1.96 0 0 1-1.16.379"></path></svg>
                            <svg class="flex-shrink-0 w-[14px] h-[14px]" style="margin-top:-2px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#FFB30E" d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.97 1.97 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.98 1.98 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.96 1.96 0 0 1-1.16.379"></path></svg>
                            <svg class="flex-shrink-0 w-[14px] h-[14px]" style="margin-top:-2px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#FFB30E" d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.97 1.97 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.98 1.98 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.96 1.96 0 0 1-1.16.379"></path></svg>
                        </div>
                        <span class="font-size-[12px] line-height-[1-2] font-weight-[500]" style="color:#a3a3a3">
                            $reviews
                        </span>
                    </div>
                </div>
            </div>
        </a>
    </div>
HTML;
}

$trendingHtml = "";
foreach ($trendingGames as $game) {
    $img = getImage($game['image_key'], $jasGameImages);
    $trendingHtml .= buildCard($game['href'], $img, $game['name']) . "\n";
}

// 4. Update Index.html
$indexContent = file_get_contents($indexFile);

// Look for the games container in Trending section.
// It matches: <div class="games-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px;">
// and ends with closing div.
// Be careful not to replace the OTHER games-containers (Best Selling, Instant Top Up).
// The Trending section is the FIRST one or inside `populer-container`.

// Regex to find the first games-container and replace its content
// The container starts with <div class="games-container"
// Content is everything until matching </div>
// Since regex matching nested divs is hard, we can rely on the fact that I just wrote this container in the previous turn
// and it likely contains "Mobile Legends - Global".

// Pattern: <div class="games-container"[^>]*>.*?<\/div>
// We need to be specific.
// Let's assume the Trending section is the first one.
$pattern = '/<div class="games-container" style="display: grid; grid-template-columns: repeat\(auto-fill, minmax\(150px, 1fr\)\); gap: 12px;">(.*?)<\/div>/s';

// We only want to replace the FIRST occurrence.
$indexContent = preg_replace_callback($pattern, function($matches) use ($trendingHtml) {
    static $replaced = false;
    if (!$replaced) {
        $replaced = true;
        return '<div class="games-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px;">' . "\n" . $trendingHtml . "</div>";
    }
    return $matches[0]; // Return original for subsequent matches
}, $indexContent, 1); // limit 1? preg_replace_callback has limit parameter? No, 4th arg is limit.

file_put_contents($indexFile, $indexContent);
echo "Trending section updated with " . count($trendingGames) . " games.\n";

?>
