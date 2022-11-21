<?php
function randHash($len = 32)
{
    return substr(md5(openssl_random_pseudo_bytes(20)), -$len);
}

function add_playlist($nom, $auteur, $image)
{
    #Connection a la DB
    include("dbConnect.php");

    $ret = "";
    if ($nom != "") {
        #Creation fichier
        //Image avec nom aléatoire
        $split = explode(".", $image['name']);
        $hashimage = (randHash(8) . "." . $split[1]);
        $hashlink = randHash(12);
        move_uploaded_file($image['tmp_name'], "images/playlist/" . $hashimage);

        #Ajout DB
        $sql = "INSERT INTO `playlists`(`nom`, `auteur`, `image`,`musiques`, `hashlink`) VALUES ('$nom','$auteur','$hashimage','','$hashlink')";
        mysqli_query($mysqli, $sql);
        echo ("<p style='color:green'> . $sql .</p>");
    } else {
        echo ("<p style='color: darkred'> Remplissez correctement le formulaire !</p>");
    }

    #Fermeture connection
    mysqli_close($mysqli);
}