<?php
function randHash($len = 32)
{
    return substr(md5(openssl_random_pseudo_bytes(20)), -$len);
}

#Connection a la DB
include("dbConnect.php");

$nom= $_POST["nom"];
$image = $_FILES["image"];
$iduser = $_POST["session"];

#Creation fichier
//Image avec nom aléatoire
$split = explode(".", $image['name']);
$hashimage = (randHash(8) . "." . $split[1]);
$hashlink = randHash(12);
move_uploaded_file($image['tmp_name'], "../images/playlist/".$hashimage);

//recup nom d'utilisateur
$sql = "SELECT login FROM `utilisateurs` WHERE id=$iduser";
$result = mysqli_query($mysqli, $sql);
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row;
}
$auteur = $emparray[0]['login'];

#Ajout DB
$sql = "INSERT INTO `playlists`(`nom`, `auteur`, `image`,`musiques`, `hashlink`) VALUES ('$nom','$auteur','".$hashimage."','','$hashlink')";
//echo($sql);
mysqli_query($mysqli, $sql);

#Fermeture connection
mysqli_close($mysqli);

?>
