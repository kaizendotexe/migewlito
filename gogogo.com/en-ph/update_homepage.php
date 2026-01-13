<?php

// 1. Read index.html
$file = "c:/xampp/htdocs/migewlito's/gogogo.com/en-ph/index.html";
$content = file_get_contents($file);

// 2. Extract existing games (Link, Image, Title) to build a map
// Pattern matches the structure in index.html
// <div class="card-games-b"> ... <a href="..."> ... <img ... src="..."> ... <h1 ...>Title</h1>
$pattern = '/<div class="card-games-b">\s*<a href="([^"]+)">.*?<img class="image-games-b" src="([^"]+)".*?<h1 class="title-games-b">([^<]+)<\/h1>/s';

preg_match_all($pattern, $content, $matches, PREG_SET_ORDER);

$games_db = [];
foreach ($matches as $m) {
    $link = $m[1];
    $image = $m[2];
    $title = trim($m[3]);
    
    // Normalize title for key
    $key = strtolower($title);
    $games_db[$key] = [
        'link' => $link,
        'image' => $image,
        'title' => $title
    ];
}

// Manual fixes/additions if regex missed something or for specific naming conventions
// We want to make sure we find these specific games
$game_map_keys = [
    'mobile legends - philippines' => 'Mobile Legends - Philippines',
    'mobile legends - global' => 'Mobile Legends - Global',
    'mobile legends - malaysia' => 'Mobile Legends - Malaysia',
    'genshin impact' => 'Genshin Impact', // Check actual title in index.html
    'roblox' => 'Roblox',
    'chamet' => 'Chamet',
    'poppo live' => 'Poppo Live',
    'valorant' => 'Valorant',
    'magic chess: go go' => 'Magic Chess: Go Go',
    'wuthering waves' => 'Wuthering Waves',
    'delta force' => 'Delta Force',
    'honor of kings' => 'Honor of Kings',
    'crystal of atlan' => 'Crystal of Atlan',
    'night crows' => 'Night Crows',
    'blood strike' => 'Blood Strike',
    'dragon nest 2' => 'Dragon Nest 2',
    'crossfire' => 'Crossfire',
    'ragnarok m' => 'Ragnarok M',
    'pubg mobile' => 'PUBG Mobile',
    'palworld' => 'Palworld',
    'free fire' => 'Free Fire',
    'discord nitro' => 'Discord Nitro',
    'minecraft' => 'Minecraft',
    'target' => 'Target',
    'viu' => 'Viu',
    'bigo live' => 'Bigo Live',
    'starmaker' => 'StarMaker',
    'bstation' => 'Bstation',
    'wesing' => 'WeSing',
    'lita' => 'Lita',
    'garena shells' => 'Garena Shells',
    'steam wallet' => 'Steam Wallet',
    'razer gold' => 'Razer Gold'
];

// Helper to find game in DB by loose match
function findGame($name, $db) {
    $name = strtolower($name);
    foreach ($db as $key => $data) {
        if (strpos($key, $name) !== false) {
            return $data;
        }
    }
    return null;
}

// 3. Define the Categories and their Games
$categories = [
    "Best Seller" => [
        "Mobile Legends - Philippines",
        "Genshin Impact",
        "Roblox",
        "Chamet",
        "Poppo Live",
        "Valorant",
        "PUBG Mobile"
    ],
    "New Games" => [
        "Magic Chess: Go Go",
        "Wuthering Waves",
        "Delta Force",
        "Honor of Kings",
        "Crystal of Atlan",
        "Night Crows"
    ],
    "Mobile Legends Other Region" => [
        "Mobile Legends - Malaysia",
        "Mobile Legends - Global"
    ],
    "Riot Games" => [
        "Valorant"
        // Add LOL if exists in DB
    ],
    "Hoyoverse Games" => [
        "Genshin Impact",
        "Honkai: Star Rail"
    ],
    "Other Games" => [
        "Blood Strike",
        "Dragon Nest", // Dragon Nest M
        "Crossfire",
        "Ragnarok M",
        "Palworld",
        "Free Fire",
        "Discord Nitro",
        "Minecraft",
        "Target", // Target Gift Card
        "Viu",
        "Bigo Live",
        "StarMaker",
        "Bstation",
        "WeSing",
        "Lita"
    ],
    "Voucher" => [
        "Garena Shells",
        "Steam Wallet",
        "Razer Gold",
        "Roblox" // Roblox Gift Card often in voucher too
    ]
];

// 4. Generate New HTML
$new_html = "";

// SVG Constants
$instant_svg = '<svg class="flex-shrink-0 w-[10px] h-[10px]" width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.78544 0.784116C5.89297 0.543304 5.81278 0.262064 5.59226 0.107382C5.37173 -0.0473002 5.07101 -0.0332382 4.86507 0.139021L0.199411 4.07638C0.0171582 4.23106 -0.0484527 4.47891 0.0372059 4.69687C0.122865 4.91483 0.341567 5.06248 0.583963 5.06248H2.61608L1.21456 8.21588C1.10703 8.4567 1.18722 8.73794 1.40774 8.89262C1.62827 9.0473 1.92899 9.03324 2.13493 8.86098L6.80059 4.92362C6.98284 4.76894 7.04845 4.52109 6.96279 4.30313C6.87714 4.08517 6.66025 3.93928 6.41604 3.93928H4.38392L5.78544 0.784116Z" fill="currentColor"></path></svg>';
$star_svg = '<svg class="flex-shrink-0 w-[14px] h-[14px]" style="margin-top:-2px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#FFB30E" d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.97 1.97 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.98 1.98 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.96 1.96 0 0 1-1.16.379"></path></svg>';

foreach ($categories as $catName => $gameList) {
    $new_html .= '<div data-category-out="' . $catName . '" class="w-100 position-relative overflow-hidden mb-4">';
    
    // Header
    // Note: Removed the image icon in header as I don't have it, used text only or I can use a placeholder if critical.
    // jastopup.html has <img class=icons-heading ...> <h1 class=title-heading>...</h1>
    // I will use just the H1 for now unless I find a generic icon.
    $new_html .= '<div class="d-flex justify-content-start align-items-center gap-[8px] mb-3">';
    $new_html .= '<h1 class="title-heading" style="font-size: 1.5rem; font-weight: bold; color: #fff;">' . $catName . '</h1>';
    $new_html .= '</div>';
    
    // Grid Container
    $new_html .= '<div class="games-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px;" data-category="' . strtolower(str_replace(' ', '-', $catName)) . '">';
    
    foreach ($gameList as $gameName) {
        $gameData = findGame($gameName, $games_db);
        if ($gameData) {
            $link = $gameData['link'];
            $image = $gameData['image'];
            $title = $gameData['title'];
            
            // Random review count for "JasTopUp design" feel (optional, but matches design)
            $reviews = rand(50, 500);
            
            $new_html .= '<div class="card-games-b">';
            $new_html .= '<a href="' . $link . '">';
            $new_html .= '<div class="gemsen"><span>Hot</span></div>';
            $new_html .= '<img class="image-games-b" src="' . $image . '" alt="' . $title . '">';
            $new_html .= '<div class="text-games-b gap-[12px] md:gap-[16px]">';
            $new_html .= '<h1 class="title-games-b">' . $title . '</h1>';
            $new_html .= '<div class="w-100 position-relative d-flex flex-column gap-[8px]">';
            $new_html .= '<div class="w-100 d-flex align-items-center gap-[4px]">' . $instant_svg . '<span class="font-size-[10px] line-height-[15px] font-weight-[500]">Instant</span></div>';
            $new_html .= '<div class="w-100 d-flex flex-column align-items-start justify-content-start gap-[4px]">';
            $new_html .= '<div class="d-flex align-items-center gap-[4px]"><span class="font-size-[14px] font-weight-[700] d-none sf-hidden" style="color:#FFB30E">5.0</span>';
            for ($i=0; $i<5; $i++) $new_html .= $star_svg;
            $new_html .= '</div>';
            $new_html .= '<span class="font-size-[12px] line-height-[1-2] font-weight-[500]" style="color:#a3a3a3">' . $reviews . ' reviews</span>';
            $new_html .= '</div></div></div>'; // End text-games-b and inner divs
            $new_html .= '</a></div>'; // End card
        }
    }
    
    $new_html .= '</div>'; // End games-container
    $new_html .= '</div>'; // End category div
}

// 5. Replace content in index.html
$start_marker = '<div class="tabs-container container">';
$end_marker = '<div class="faq-container container">';

$parts1 = explode($start_marker, $content);
$parts2 = explode($end_marker, $content);

if (count($parts1) > 1 && count($parts2) > 1) {
    // Reconstruct
    // Part before
    $before = $parts1[0];
    
    // Part after (we need the content starting from faq-container)
    // explode by end_marker splits the file. The last part is the FAQ and footer.
    // Wait, explode might be tricky if the marker appears multiple times. It shouldn't.
    
    // Let's use strpos for safety
    $start_pos = strpos($content, $start_marker);
    $end_pos = strpos($content, $end_marker);
    
    if ($start_pos !== false && $end_pos !== false) {
        $new_content = substr($content, 0, $start_pos) . 
                       '<div class="container">' . $new_html . '</div>' . 
                       substr($content, $end_pos);
                       
        file_put_contents($file, $new_content);
        echo "Successfully updated index.html with new game structure.";
    } else {
        echo "Error: Could not find start or end markers.";
    }
} else {
    echo "Error: Markers not found.";
}

?>
