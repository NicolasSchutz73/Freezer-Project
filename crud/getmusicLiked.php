<?php
include('dbConnect.php');

session_start();
$idSession = $_SESSION['id'];

#Selection data
$sql = "SELECT musiques FROM utilisateurs WHERE id=$idSession";
$result = mysqli_query($mysqli, $sql);

#Resultats vers JS
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row;
}
echo json_encode($emparray);

mysqli_close($mysqli);