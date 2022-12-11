<?php
#Connection a la DB
include("dbConnect.php");
session_start();

$name = $_POST["nom"];
$link = $_POST['link'];

#Ajout DB
$sql = "UPDATE `playlists` SET `nom`='$name' WHERE `hashlink`='$link'";
//echo($sql);
mysqli_query($mysqli, $sql);

#Fermeture connection
mysqli_close($mysqli);

?>