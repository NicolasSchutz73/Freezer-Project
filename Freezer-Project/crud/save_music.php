<?php
include("dbConnect.php");

$requete = "SELECT * FROM musics";
$result = mysqli_query($mysqli, $requete);



$music = array();

while ($row = mysqli_fetch_array($result)) {
    $titre = $row['nom_music'];
    $artiste = $row['nom_artiste'];
    $genre = $row['genre'];
    $image = $row['image'];
    $musique = $row['fichier'];
    $id = $row['id'];
    $tabMusic = array(
        'id' => $id,
        'Titre' => $titre,
        'Artiste' => $artiste,
        'Genre' => $genre,
        'Image' => $image,
        'Musique' => $musique
    );
    array_push($music, $tabMusic);
}

file_put_contents(
    "data_music.json",
    json_encode(
        $music,
        JSON_PRETTY_PRINT |
            JSON_UNESCAPED_UNICODE |
            JSON_UNESCAPED_SLASHES
    )
);
header("Location: ../admin/admin.php");
