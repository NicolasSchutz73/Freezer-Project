<?php
//Connection db
include("../crud/dbConnect.php");

//get
$login = $_GET["login"];
$pwd = $_GET["pwd"];
$pwdconfirm = $_GET["pwdconfirm"];

//voir si le nom est deja pris
$sql = 'select * from utilisateurs where login="'.$login.'"';
$result = mysqli_query($mysqli, $sql);

$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row;
}
if(count($emparray)==1){
    echo("taken");
} else {
    if($login!="" and $pwd!="" and $pwdconfirm!="" and $pwd==$pwdconfirm){
        echo("ok");
    } else {
        echo("nok");
    }
}

mysqli_close($mysqli);
?>