<?php
include("dbConnect.php");

$iduser = $_GET["idUser"];

//recup nom d'utilisateur
$sql = "SELECT login FROM `utilisateurs` WHERE id=$iduser";
$result = mysqli_query($mysqli, $sql);
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row;
}
$login = $emparray[0]['login'];

//recup playlists
$sql = "SELECT * FROM `playlists` WHERE auteur='$login'";
$result = mysqli_query($mysqli, $sql);
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row;
}

echo json_encode($emparray);

#Fermeture connection
mysqli_close($mysqli);

?>