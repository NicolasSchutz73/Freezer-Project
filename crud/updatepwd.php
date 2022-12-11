<?php
//Connection db
include("../crud/dbConnect.php");

session_start();

$pwd=$_POST['pwd'];
$id=$_SESSION['id'];

//hash pwd
$salt = "sdK2mqlOs4dUibu57SZVGT8qHsmiOm6AqZs5DdkGN4KvghM3dqkfN5DhghplJG539qdm7hSFG8Kgv9qmhcetYHvDERfHF412csr79hfEScgmKH53dSXCVtyh75gDSer1";
$pwd = hash("sha256", $pwd . $salt);

$sql="UPDATE `utilisateurs` SET `pwd`='$pwd' WHERE id=$id";
$result = mysqli_query($mysqli, $sql);

mysqli_close($mysqli);

?>