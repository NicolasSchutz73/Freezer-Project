<?php
function randHash($len = 32)
{
    return substr(md5(openssl_random_pseudo_bytes(20)), -$len);
}

#Connection a la DB
include("dbConnect.php");
session_start();

$image = $_FILES["image"];
$link = $_POST['link'];

#Creation fichier
//Image avec nom aléatoire
$split = explode(".", $image['name']);
$hashimage = (randHash(8) . "." . $split[1]);
move_uploaded_file($image['tmp_name'], "../images/playlist/".$hashimage);

#Ajout DB
$sql = "UPDATE `playlists` SET `image`='$hashimage' WHERE `hashlink`='$link'";
//echo($sql);
mysqli_query($mysqli, $sql);

#Fermeture connection
mysqli_close($mysqli);

?>