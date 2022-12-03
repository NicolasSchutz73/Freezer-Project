<?php

$idSession = $_SESSION['id'];

#Selection data
$sql = "SELECT musiques FROM likedtitle WHERE id=$idSession";
$result = mysqli_query($mysqli, $sql);

#Resultats vers JS
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row;
}
$musiques = $emparray[0]['musiques'];

$sql="UPDATE `playlists` SET `musiques` = '$musiques' WHERE id='4'";
$result = mysqli_query($mysqli, $sql);


mysqli_close($mysqli);