<?php
include('dbConnect.php');

session_start();
$idSession = $_SESSION['id'];

#Selection data
$sql = "SELECT `musique` FROM `historique` WHERE id=$idSession";
$result = mysqli_query($mysqli, $sql);

#Resultats vers JS
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row['musique'];
}

$res = implode(",",$emparray);

echo json_encode($res);

mysqli_close($mysqli);