
<?php


include("../crud/dbConnect.php");



if (isset($_POST['login'])) {
    $login = $_POST['login'];
}
$email = NULL;
if (isset($_POST['email'])) {
    $email = $_POST['email'];
}
$birth = NULL;
if (isset($_POST['birth'])) {
    $birth = $_POST['birth'];
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


if ($dif != True && $login != NULL && $login != "" && $email != NULL && $email != "" && $birth != NULL && $birth != "" && $pwd != NULL && $pwd != "" && $pwd == $pwdConfirm) {
    $salt = "sdK2mqlOs4dUibu57SZVGT8qHsmiOm6AqZs5DdkGN4KvghM3dqkfN5DhghplJG539qdm7hSFG8Kgv9qmhcetYHvDERfHF412csr79hfEScgmKH53dSXCVtyh75gDSer1";
    $pwd = hash("sha256", $pwd . $salt);
    $requete = "INSERT INTO `utilisateurs` (`id`, `login`, `pwd`, `email`, `dateOfbirth`) VALUES (NULL, '$login', '$pwd', '$email', '$birth');";
    $resultat = mysqli_query($mysqli, $requete);
}
echo ($requete);

$mysqli->close();


if ($resultat && $dif != True) {
    header("Location: login.php");
} else {
    header("Location: register.php");
}


?>
