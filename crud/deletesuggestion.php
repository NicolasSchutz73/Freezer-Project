<?php
$id = $_GET["id"];

#Connection a la DB
include("dbConnect.php");

#Selection data
$sqlDel = "DELETE FROM suggestions WHERE id=$id";
$resultDel = mysqli_query($mysqli, $sqlDel);

$sql = "select * from suggestions";
$result = mysqli_query($mysqli, $sql);

#Resultats vers JS
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row;
}
echo json_encode($emparray);

#Fermeture connection
mysqli_close($mysqli);
