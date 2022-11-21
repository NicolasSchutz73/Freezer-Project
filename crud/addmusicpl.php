<?php
$idpl = $_GET["idpl"];
$idmusic = $_GET["idmusic"];

#Connection a la DB
include("dbConnect.php");

#Selection data
$sql = "SELECT musiques FROM playlists WHERE id=$idpl";
$result = mysqli_query($mysqli, $sql);

#Resultats vers JS
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row;
}
$musiques = $emparray[0]['musiques'];

if ($musiques == '') {
    //Pas de musiques dans la playlist
    $sql="UPDATE `playlists` SET `musiques` = '$idmusic' WHERE `playlists`.`id` = $idpl";
    $result = mysqli_query($mysqli, $sql);
} else {
    //Au moins une musique
    $sql="UPDATE `playlists` SET `musiques` = '$musiques" . ',' . "$idmusic' WHERE `playlists`.`id` = $idpl";
    $result = mysqli_query($mysqli, $sql);
}

#Fermeture connection
mysqli_close($mysqli);