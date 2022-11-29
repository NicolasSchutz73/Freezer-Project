
<?php


include("../crud/dbConnect.php");



if (isset($_POST['login'])) {
    $login = $_POST['login'];
}
$email = NULL;
if (isset($_POST['email'])) {
    $email = $_POST['email'];
}

$pwd = NULL;
if (isset($_POST['pwd'])) {
    $pwd = $_POST['pwd'];
}
$pwdConfirm = NULL;
if (isset($_POST['pwdConfirm'])) {
    $pwdConfirm = $_POST['pwdConfirm'];
}


$requete = "SELECT login FROM `utilisateurs` ;";
$resultat = $mysqli->query($requete);
while ($ligne = $resultat->fetch_assoc()) {
    if ($ligne['login'] === $login) {
        $dif = True;
    }
}

$login = $mysqli->real_escape_string($login);
$pwd = $mysqli->real_escape_string($pwd);


if ($dif != True && $login != NULL && $login != "" && $email != NULL && $email != "" && $pwd != NULL && $pwd != "" && $pwd == $pwdConfirm) {
    $salt = "sdK2mqlOs4dUibu57SZVGT8qHsmiOm6AqZs5DdkGN4KvghM3dqkfN5DhghplJG539qdm7hSFG8Kgv9qmhcetYHvDERfHF412csr79hfEScgmKH53dSXCVtyh75gDSer1";
    $pwd = hash("sha256", $pwd . $salt);
    $requete = "INSERT INTO `utilisateurs` (`id`, `login`, `pwd`, `email`) VALUES (NULL, '$login', '$pwd', '$email');";
    $resultat = mysqli_query($mysqli, $requete);
}


$requete_id = "SELECT id FROM `utilisateurs` WHERE login='$login';";
$resultat_id = $mysqli->query($requete_id);
while ($ligne = $resultat_id->fetch_assoc()) {
    $id = $ligne['id'];
}


if ($resultat && $dif != True) {
    session_start();
    // $request = "UPDATE `utilisateurs` set statut= 'connected'  WHERE id= $id";
    // $resultat = mysqli_query($mysqli, $request);

    $_SESSION['id'] = $id;
    $request = "INSERT INTO `likedtitle` (`id`, `musiques`) VALUES ('$id', NULL)";
    $resultat = mysqli_query($mysqli, $request);
    header("Location: ../index.php");
} else {
    header("Location: register.php");
}



$mysqli->close();

?>
