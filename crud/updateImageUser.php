<?php
function randHash($len = 32)
{
    return substr(md5(openssl_random_pseudo_bytes(20)), -$len);
}

#Connection a la DB
include("dbConnect.php");
session_start();

$image = $_FILES["image"];
$iduser = $_SESSION['id'];

#Creation fichier
//Image avec nom aléatoire
$split = explode(".", $image['name']);
$hashimage = (randHash(8) . "." . $split[1]);
move_uploaded_file($image['tmp_name'], "../images/user/".$hashimage);

#Ajout DB
$sql = "UPDATE `utilisateurs` SET `image`='$hashimage' WHERE id=$iduser";
//echo($sql);
mysqli_query($mysqli, $sql);

#Fermeture connection
mysqli_close($mysqli);

?>