<?php
//Connection db
include("../crud/dbConnect.php");

//get
$login = $_GET["login"];
$pwd = $_GET["pwd"];

//voir si l'utilisateur existe
$sql = 'select * from utilisateurs where login="'.$login.'"';
$result = mysqli_query($mysqli, $sql);

$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row;
}

//l'utilisateur n'existe pas
if(count($emparray)==0){
    echo("noaccount");
    //si il existe
} else {
    //hash pwd
    $salt = "sdK2mqlOs4dUibu57SZVGT8qHsmiOm6AqZs5DdkGN4KvghM3dqkfN5DhghplJG539qdm7hSFG8Kgv9qmhcetYHvDERfHF412csr79hfEScgmKH53dSXCVtyh75gDSer1";
    $pwd = hash("sha256", $pwd . $salt);

    //bon mdp
    if($pwd==$emparray[0]["pwd"]){
        echo($emparray[0]["id"]);

    //mauvais mdp
    } else {
        echo("wrongpwd");
    }

}

mysqli_close($mysqli);
?>