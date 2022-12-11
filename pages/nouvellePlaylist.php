
<h1>Nouvelle Playlist</h1>
<div>
<p>Nom de la playlist : </p>
<input type="text" id="nomPlaylist">
<p>Image : </p>
<label class="formulaire-file">
    <input type="file" id="imagePlaylist" accept="image/png, image/jpeg">
    Choississez une image
</label>
<p id="file-name"></p>
<p id="invalidform"></p>
</div>
<button>Créer la playlist</button>

<?php

    function randHash($len = 32)
{
    return substr(md5(openssl_random_pseudo_bytes(20)), -$len);
}

function add_playlist($nom, $auteur, $image)
{
    #Connection a la DB
    $mysqli = mysqli_connect("localhost", "elias", "admin", "freezerdb");
    mysqli_set_charset($mysqli, "utf8");

    $ret = "";
    if ($nom != "") {
        #Creation fichier
        //Image avec nom aléatoire
        $split = explode(".", $image['name']);
        $hashimage = (randHash(8) . "." . $split[1]);
        $hashlink = randHash(12);
        move_uploaded_file($image['tmp_name'], "../images/playlist/".$hashimage);

        #Ajout DB
        $sql = "INSERT INTO `playlists`(`nom`, `auteur`, `image`,`musiques`, `hashlink`) VALUES ('$nom','$auteur','$hashimage','','$hashlink')";
        mysqli_query($mysqli, $sql);
    }

    #Fermeture connection
    mysqli_close($mysqli);
}

if (isset($_POST["nom"]) &&
isset($_POST["submit"]) &&
!empty($_FILES["image"]['name'])){
    add_playlist($_POST['nom'],"utilisateur",$_FILES["image"]);
}

?>
