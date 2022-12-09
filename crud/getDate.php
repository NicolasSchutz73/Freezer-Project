<?php
include('dbConnect.php');

session_start();
$idSession = $_SESSION['id'];

#Selection data
$sql = "SELECT `date` FROM `historique` WHERE id=$idSession";
$result = mysqli_query($mysqli, $sql);

#Resultats vers JS
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row['date'];
}

$res = array_reverse($emparray);

echo json_encode($res,JSON_UNESCAPED_UNICODE);

mysqli_close($mysqli);