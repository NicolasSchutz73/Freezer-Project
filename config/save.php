<?php

include("../crud/dbConnect.php");

$requete = "SELECT * FROM musics";
$result = mysqli_query($mysqli, $requete);



$music = array();
$idData = 0;

while ($row = mysqli_fetch_array($result)) {
    $titre = $row['nom_music'];
    $artiste = $row['nom_artiste'];
    $linkMusic = $row['fichier'];
    $imgMusic = $row['image'];
    $genreMusic = $row['genre'];
    $idMusic = $row['id'];

    $tabMusic = array(
        'idData' => $idData,
        'idMusic' => $idMusic,
        'titre' => $titre,
        'artiste' => $artiste,
        'musique' => $linkMusic,
        'genre' => $genreMusic,
        'image' => $imgMusic
    );

    array_push($music, $tabMusic);
    $idData++;
}

file_put_contents(
    $_SERVER['DOCUMENT_ROOT'] . 'Freezer-Project/json/data_footer.json',
    json_encode(
        $music,
        JSON_PRETTY_PRINT |
            JSON_UNESCAPED_UNICODE |
            JSON_UNESCAPED_SLASHES
    )
);
