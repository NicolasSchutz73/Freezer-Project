<?php
function randHash($len = 32)
{
    return substr(md5(openssl_random_pseudo_bytes(20)), -$len);
}

#Connection a la DB
include("dbConnect.php");

$nomMusique= $_POST["nomMusique"];
$nomArtiste= $_POST["nomArtiste"];
$genre = $_POST["genre"];
$image = $_FILES["imageMusique"];
$musique = $_FILES["musique"];

#Creation fichier
//Image avec nom aléatoire
$split = explode(".", $image['name']);
$hashimage = (randHash(8) . "." . $split[1]);
move_uploaded_file($image['tmp_name'], "../images/musique/".$hashimage);
//Musique avec nom aléatoire
$split = explode(".", $musique['name']);
$hashmusique = (randHash(8) . "." . $split[1]);
move_uploaded_file($musique['tmp_name'], "../musiques/".$hashmusique);

#Ajout DB
$sql = "INSERT INTO `musics`(`nom_music`, `nom_artiste`, `genre`, `image`, `fichier`) VALUES ('$nomMusique','$nomArtiste','$genre','$hashimage','$hashmusique')";
//echo($sql);
mysqli_query($mysqli, $sql);

#Fermeture connection
mysqli_close($mysqli);

?>
