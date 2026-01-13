<?php
$html = file_get_contents("c:/xampp/htdocs/migewlito's/gogogo.com/en-ph/assets/images/jastopup.html");

// Regex to find categories and their content
preg_match_all('/<div data-category-out="([^"]+)"[^>]*>(.*?)<\/div>\s*(?=<div data-category-out|$)/s', $html, $matches, PREG_SET_ORDER);

$categories = [];

foreach ($matches as $match) {
    $categoryName = $match[1];
    $categoryContent = $match[2];
    
    // Find games in this category
    // Looking for <h1 class="title-games-b">Game Name</h1>
    preg_match_all('/<h1 class="title-games-b">([^<]+)<\/h1>/', $categoryContent, $gameMatches);
    
    $categories[$categoryName] = $gameMatches[1];
}

print_r($categories);
?>
