<?php
//define('SITE_ROOT', __DIR__);

$dir = dirname(__FILE__); //récupère le nom du dossier du fichier
define('ROOT_DIR', $dir);

//chemin du dossier css
//define('CSS_DIR', ROOT_DIR . '/Freezer/style');

//chemin du dossier js
//define('JS_DIR', ROOT_DIR . '/Freezer/script');

$host = $_SERVER['HTTP_HOST'];

define('HOST', 'http://' . $host);

//chemin du dossier style
define('HOST_CSS', HOST . '/Freezer-Project/style');

//chemin du dossier script
define('HOST_JS', HOST . '/Freezer-Project/script');

//chemin du dossier images
define('HOST_IMG', HOST . '/Freezer-Project/images');



