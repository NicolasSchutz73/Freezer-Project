<?php
//Connection db
include("../crud/dbConnect.php");

//get
$login = $_GET["login"];
$pwd = $_GET["pwd"];

//image par défaut
$images = "default.png";

//hash mdp
$salt = "sdK2mqlOs4dUibu57SZVGT8qHsmiOm6AqZs5DdkGN4KvghM3dqkfN5DhghplJG539qdm7hSFG8Kgv9qmhcetYHvDERfHF412csr79hfEScgmKH53dSXCVtyh75gDSer1";
$pwd = hash("sha256", $pwd . $salt);
$requete = "INSERT INTO `utilisateurs` (`login`, `pwd`, `images`) VALUES ('$login', '$pwd', '$images');";

//envoie
$resultat = mysqli_query($mysqli, $requete);

//get id
$sql = 'select id from utilisateurs where login="' . $login . '"';
$result = mysqli_query($mysqli, $sql);

$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row;
}

//affichage id
echo ($emparray[0]['id']);
