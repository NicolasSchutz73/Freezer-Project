<?php

#Connection a la DB
include("dbConnect.php");


#Récupération variable
$id = $_GET['id']-1;
$hashlink = $_GET['hashlink'];


#Selection data
$sql = "SELECT musiques FROM playlists WHERE hashlink='$hashlink'";
$result = mysqli_query($mysqli, $sql);

#Resultats vers JS
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row['musiques'];
}

$musiques = explode(",", $emparray[0]);

unset($musiques[$id]);

$musiques = implode(",",$musiques);

$sql="UPDATE `playlists` SET `musiques` = '$musiques' WHERE hashlink='$hashlink'";
//echo($sql);
$result = mysqli_query($mysqli, $sql);

#Fermeture connection
mysqli_close($mysqli);
?>