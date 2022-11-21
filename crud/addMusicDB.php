<?php

include("dbConnect.php");

$Titre = NULL;
if (isset($_POST['Titre'])) {
    $Titre = $_POST['Titre'];
}
$Artiste = NULL;
if (isset($_POST['Artiste'])) {
    $Artiste = $_POST['Artiste'];
}
$Genre = NULL;
if (isset($_POST['Genre'])) {
    $Genre = $_POST['Genre'];
}

$path_image = NULL;
if (isset($_FILES['image']) and $_FILES['image']['error'] == 0) {
    $pp = $_FILES['image']['tmp_name'];
    $toDB_I = $_FILES['image']['name'];
    $path_image = '../images/musique/' . $_FILES['image']['name'];
    move_uploaded_file($pp, $path_image);
}

$path_music = NULL;
if (isset($_FILES['music']) and $_FILES['music']['error'] == 0) {
    $mm = $_FILES['music']['tmp_name'];
    $toDB_M = $_FILES['music']['name'];
    $path_music = '../musiques/' . $_FILES['music']['name'];
    move_uploaded_file($mm, $path_music);
}
if ($Titre != NULL && $Titre != "" && $Artiste != NULL && $Artiste != "" && $Genre != NULL && $Genre != "" && $path_image != NULL && $path_image != "" && $path_music != NULL && $path_music != "") {
    $requete = "INSERT INTO `musics` (`id`, `nom_music`, `nom_artiste`, `genre`, `image`, `fichier` ) VALUES (NULL, '$Titre', '$Artiste', '$Genre', '$toDB_I', '$toDB_M');";
    $resultat = mysqli_query($mysqli, $requete);
}
$mysqli->close();


if ($resultat) {
    header("Location: ../index.php");
} else {
    header("Location: ../pages/addMusic.php");
}
?>