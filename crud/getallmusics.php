<?php

#Connection a la DB
#A changer :
include("dbConnect.php");
#Selection data
$sql = "select * from musics";
$result = mysqli_query($mysqli, $sql);

#Resultats vers JS
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row;
}
echo json_encode($emparray);

#Fermeture connection
mysqli_close($mysqli);
