<?php

#Connection a la DB
#A changer :
include("dbConnect.php");
#Selection data

$recherche = $_GET['search'];

if($recherche!="null"){
    $recherche = htmlspecialchars($_GET['search']);
    $sql = 'select * from playlists where nom like "%'.$recherche.'%"';
}
else{
    $sql = 'select * from playlists';
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
