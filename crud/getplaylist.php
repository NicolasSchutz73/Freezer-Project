<?php
$pl = $_GET["pl"];
#Connection a la DB
#A changer :
include("dbConnect.php");
#Selection data
$sql = "SELECT * FROM `playlists` WHERE hashlink='" . $pl . "'";
$result = mysqli_query($mysqli, $sql);

#Resultats vers JS
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row;
}
echo json_encode($emparray);

#Fermeture connection
mysqli_close($mysqli);
