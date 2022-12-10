<?php

$iduser = $_GET["iduser"];
$musique = $_GET["musique"];
$artiste = $_GET["artiste"];
$commentaire = $_GET["commentaire"];

#Connection a la DB
include("dbConnect.php");

if($musique!="" and $artiste!=""){

    //recup nom d'utilisateur
    $sql = "SELECT login FROM `utilisateurs` WHERE id=$iduser";
    $result = mysqli_query($mysqli, $sql);
    $emparray = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $emparray[] = $row;
    }
    $login = $emparray[0]['login'];

    //Insertion suggestion
    $sql = "INSERT INTO `suggestions`(`utilisateur`, `musique`, `artiste`, `commentaire`) VALUES ('$login','$musique','$artiste','$commentaire')";
    $result = mysqli_query($mysqli, $sql);
    echo("OK");
} else {
    echo("NOK");
}

mysqli_close($mysqli);
?>