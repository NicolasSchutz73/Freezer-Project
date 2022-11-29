<?php

#Connection a la DB
include("dbConnect.php");


#Récupération variable session et id musique
session_start();
$idSession = $_SESSION['id'];
$idMusicLiked = $_GET['idMusic'] + 1;


#Selection data
$sql = "SELECT musiques FROM likedtitle WHERE id=$idSession";
$result = mysqli_query($mysqli, $sql);

#Resultats vers JS
$emparray = array();
while ($row = mysqli_fetch_assoc($result)) {
    $emparray[] = $row['musiques'];
}


$res = rechercheMusiquedansTableau($emparray[0],$idMusicLiked);

echo($res);

// # Ajout musique likée dans base de donnée

//     if ($musiques == '') {
//         //Pas de musiques dans la playlist 
//         $sql = "UPDATE `likedtitle` SET `musiques` = '$idMusicLiked' WHERE `id` = '$idSession'";
//         $result = mysqli_query($mysqli, $sql);
//     } else {
//         //Au moins une musique
//         $sql="UPDATE `likedtitle` SET `musiques` = '$musiques" . ',' . "$idMusicLiked' WHERE `likedtitle`.`id` = $idSession";
//         $result = mysqli_query($mysqli, $sql);
//     }



function rechercheMusiquedansTableau($tab, $musique){
    $yest = false;
    for($i = 0; $i <= count($tab)-1; $i ++){
        if($tab[$i]== $musique){
            $yest = true;
            
        }
        
    }
    return $yest;
}



#Fermeture connection
mysqli_close($mysqli);

?>