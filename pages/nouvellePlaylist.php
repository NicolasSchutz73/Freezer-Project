<form method="post" enctype="multipart/form-data" class="formulaire">
    <h1>Nouvelle Playlist</h1>
    <div>
    <p>Nom de la playlist : </p>
    <input type="text" name="nom">
    <p>Image : </p>
    <input type="file" name="image" accept="image/png, image/jpeg"><br>
    </div>
    <input type="submit" name="submit" value="Créer la playlist" />
</form>
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
        move_uploaded_file($image['tmp_name'], $hashimage);

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