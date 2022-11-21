<?php
include("../crud/dbConnect.php");


$login = NULL;
if (isset($_POST['login'])) {
    $login = $_POST['login'];
}
$pwd = NULL;
if (isset($_POST['pwd'])) {
    $pwd = $_POST['pwd'];
}

// hachage mot de passe
$salt = "sdK2mqlOs4dUibu57SZVGT8qHsmiOm6AqZs5DdkGN4KvghM3dqkfN5DhghplJG539qdm7hSFG8Kgv9qmhcetYHvDERfHF412csr79hfEScgmKH53dSXCVtyh75gDSer1";
$pwd = hash("sha256", $pwd . $salt);

$login = mysqli_real_escape_string($mysqli, $login);
$pwd = mysqli_real_escape_string($mysqli, $pwd);

$requete = "SELECT * FROM `utilisateurs` WHERE login = '$login' AND pwd = '$pwd' ;";
$resultat = mysqli_query($mysqli, $requete);

$nbLignes = mysqli_num_rows($resultat);
if ($nbLignes) {
    $ligne = mysqli_fetch_assoc($resultat);
    $id = $ligne['id'];
}

// Destruction résultat
$resultat->close();


if ($nbLignes == 0) {
    header("Location: login.php");
} else if ($nbLignes == 1) {
    session_start();
    // $request = "UPDATE `utilisateurs` set statut= 'connected'  WHERE id= $id";
    // $resultat = mysqli_query($mysqli, $request);

    $_SESSION['id'] = $id;

    header("Location: ../index.php");
}
