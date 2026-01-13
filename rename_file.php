<?php
$files = glob("c:/xampp/htdocs/migewlito's/gogogo.com/en-ph/assets/images/JasTopUp*.html");
if (count($files) > 0) {
    $oldName = $files[0];
    $newName = "c:/xampp/htdocs/migewlito's/gogogo.com/en-ph/assets/images/jastopup.html";
    if (rename($oldName, $newName)) {
        echo "Renamed $oldName to $newName\n";
    } else {
        echo "Failed to rename $oldName\n";
    }
} else {
    echo "File not found matching pattern.\n";
}
?>
