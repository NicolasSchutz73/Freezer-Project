<?php

#Connection a la DB
include("dbConnect.php");

#Récupération variable session, id musique et de la date
session_start();
$idSession = $_SESSION['id'];
$idMusicListening = $_GET['idMusic'];
$date = $_GET['date'];  


//On supprime les doublon
$sql = "DELETE FROM `historique` WHERE id=$idSession AND `musique`=$idMusicListening";
$resultat = mysqli_query($mysqli, $sql);

// On ajoute notre musique
$sql = "INSERT INTO `historique` (`id`,`musique`, `date`) VALUES ($idSession,'$idMusicListening', '$date');";
$resultat = mysqli_query($mysqli, $sql);


#Fermeture connection
mysqli_close($mysqli);

?> 