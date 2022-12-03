<?php

#Connection a la DB
include("dbConnect.php");


#Récupération variable session et id musique
session_start();
$idSession = $_SESSION['id'];
$idMusicLiked = $_GET['idMusic'] + 1;


#Selection data
$sql = "SELECT musiques FROM utilisateurs WHERE id=$idSession";
$result = mysqli_query($mysqli, $sql);

#Resultats vers JS
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row['musiques'];
}

$musiques = explode(",", $emparray[0]);

# Supprimer musique likée dans base de donnée

unset($musiques[array_search($idMusicLiked, $musiques)]);
$newtab =implode(",",$musiques);

$sql="UPDATE `utilisateurs` SET `musiques` = '$newtab' WHERE `utilisateurs`.`id` = $idSession";
$result = mysqli_query($mysqli, $sql);
$sql="UPDATE `playlists` SET `musiques` = '$newtab' WHERE `id` = '4' ";
$result = mysqli_query($mysqli, $sql);

#Fermeture connection
mysqli_close($mysqli);



