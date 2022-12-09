<?php
#Connection a la DB
include("dbConnect.php");
session_start();
#Selection data
$id = $_SESSION['id'];
$sql = "select * from musics where id in (select musique from historique where id=$id)";
$result = mysqli_query($mysqli, $sql);

#ajoute les genres dans un tableau
$genres = array();
while ($row = mysqli_fetch_assoc($result)) {
    $genres[] = $row['genre'];
}

#récupère le genre le plus présent
$genre = array_count_values($genres);
arsort($genre);
$genre = array_keys($genre)[0];


#Selection data
$sql_ = "select * from musics where genre='$genre'";
$result_ = mysqli_query($mysqli, $sql_);

#Resultats vers JS
$emparray = array();
while ($row = mysqli_fetch_assoc($result_)) {
    $emparray[] = $row;
}
echo json_encode($emparray);

#Fermeture connection
mysqli_close($mysqli);
