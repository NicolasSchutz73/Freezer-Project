<?php
$idstring = "id=" . implode(" or id=", explode(",", $_GET["id"]));
$recherche = $_GET['search'];

#Connection a la DB
include("dbConnect.php");

#Selection data
$sql = "select * from musics where " . $idstring;

if($recherche!="null"){
    $recherche = htmlspecialchars($_GET['search']);
    $sql = "select * from musics where (". $idstring .') and nom_music like "%'.$recherche.'%"';
}
else{
    $sql = "select * from musics where " . $idstring;
}
$result = mysqli_query($mysqli, $sql);

#Resultats vers JS
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row;
}
echo json_encode($emparray);

#Fermeture connection
mysqli_close($mysqli);
