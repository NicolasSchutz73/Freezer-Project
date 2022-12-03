<?php

#Connection a la DB
include("dbConnect.php");


#Récupération variable session et id musique
session_start();
$idSession = $_SESSION['id'];
$idMusicLiked = $_GET['idMusic'] + 1;


#Selection data
$sql = "SELECT musiques FROM likedtitle WHERE id=$idSession";
$result = mysqli_query($mysqli, $sql);

#Resultats vers JS
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row['musiques'];
}

# Supprimer musique likée dans base de donnée

$newTab = str_replace(",".$idMusicLiked, '',$emparray[0]);
$sql="UPDATE `likedtitle` SET `musiques` = '$newTab' WHERE `likedtitle`.`id` = $idSession";
$result = mysqli_query($mysqli, $sql);
$sql="UPDATE `playlists` SET `musiques` = '$newTab' WHERE `id` = '4' ";


