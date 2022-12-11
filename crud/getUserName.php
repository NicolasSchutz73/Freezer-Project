<?php
#Connection a la DB

include("dbConnect.php");
#Selection data
session_start();
$id=$_SESSION['id'];

$sql = "SELECT `login` FROM `utilisateurs` WHERE id=$id";


$result = mysqli_query($mysqli, $sql);

#Resultats vers JS
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row;
}
echo json_encode($emparray);

#Fermeture connection
mysqli_close($mysqli);

?>