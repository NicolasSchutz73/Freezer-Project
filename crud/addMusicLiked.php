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
    $emparray[] = $row;
}
$musiques = $emparray[0]['musiques'];

# Ajout musique likée dans base de donnée

    if ($musiques == '') {
        //Pas de musiques dans la playlist 
        $sql = "UPDATE `likedtitle` SET `musiques` = '$idMusicLiked' WHERE `id` = '$idSession'";
        $result = mysqli_query($mysqli, $sql);
        $sql = "UPDATE `playlists` SET `musiques` = '$idMusicLiked' WHERE `id` = '4'";
        $result = mysqli_query($mysqli, $sql);
    } else {
        //Au moins une musique
        $sql="UPDATE `likedtitle` SET `musiques` = '$musiques" . ',' . "$idMusicLiked' WHERE `likedtitle`.`id` = $idSession";
        $result = mysqli_query($mysqli, $sql);
        $sql = "UPDATE `playlists` SET `musiques` = '$musiques" . ',' . "$idMusicLiked' WHERE `id` = '4'";
        $result = mysqli_query($mysqli, $sql);
    }

    echo($sql);
#Fermeture connection
mysqli_close($mysqli);