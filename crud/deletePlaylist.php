<?php

#Connection a la DB
include("dbConnect.php");
session_start();
$link = $_POST['link'];

#Ajout DB
$sql = "DELETE FROM `playlists` WHERE hashlink='$link'";
//echo($sql);
mysqli_query($mysqli, $sql);

#Fermeture connection
mysqli_close($mysqli);

?>