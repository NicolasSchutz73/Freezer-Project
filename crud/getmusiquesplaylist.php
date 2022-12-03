<?php
$idsArray = explode(",", $_GET["id"]);
$recherche = htmlspecialchars($_GET['search']);

#Connection a la DB
include("dbConnect.php");

#array result
$emparray = array();

foreach($idsArray as $id){
    if($recherche!="null"){
        $sql = "select * from musics where id=". $id .' and nom_music like "%'.$recherche.'%"';
        #resultat vers array
        $result = mysqli_query($mysqli, $sql);
        while ($row = mysqli_fetch_assoc($result)) {
            $emparray[] = $row;
        }
    }
    else{
        $sql = "select * from musics where id=" . $id;
        #resultat vers array
        $result = mysqli_query($mysqli, $sql);
        while ($row = mysqli_fetch_assoc($result)) {
            $emparray[] = $row;
        }
    }
}

#Array vers JSon
echo json_encode($emparray);

#Fermeture connection
mysqli_close($mysqli);
