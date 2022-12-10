<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Freezer Music Player</title>
    <link rel="stylesheet" type="text/css" href="<?php echo HOST_CSS . '/index.css'; ?>">
    <link rel="stylesheet" type="text/css" href="<?php echo HOST_CSS . '/formulaire.css'; ?>">
    <link rel="stylesheet" type="text/css" href="<?php echo HOST_CSS . '/footer.css'; ?>">
    <link rel="icon" type="img/ico" href="<?php echo HOST_IMG . '/index/favicon.ico'; ?>" />
    <script src="https://kit.fontawesome.com/bb4997e1c6.js" crossorigin="anonymous"></script>
</head>


<div class="header">
    <?php

    // Ouverture de la session
    session_start();
    require_once(ROOT_DIR . '/components/search.php');

    //Connection à la base de donnée 
    require_once(ROOT_DIR . '/crud/dbConnect.php');


    if (isset($_SESSION['id'])) {
        $id = $_SESSION['id'];

        // Récupération du pseudo
        $pseudo = mysqli_query($mysqli, "SELECT `login` FROM `utilisateurs` WHERE `id` = $id");
        $data = mysqli_fetch_array($pseudo);
        if (isset($data['login'])) {
            $pseudo = $data['login'];
        }

        // Variable de SESSION 
        $_SESSION["pseudo"] = $pseudo;
        /*
        echo '<div class="header--buttons">';
        echo '<button class="header--button previous"> <i class="lni-chevron-left"></i> </button>';
        echo '<button class="header--button next"> <i class="lni-chevron-right"></i> </button>';
        echo '</div>';
        */
        echo '<div class="header--buttons--right">';
        echo "<button class='header--button--user' id=$id >";
        echo "<i class='fa-solid fa-user'></i> $pseudo </button>";
        echo '<button class="header--button--disconnect">';
        echo '<i class="fa-solid fa-right-from-bracket"></i> </button>';
        echo '</div>';
    } else {

        echo '<div class="header--buttons--right">';
        echo '<button class="header--button--signUp">';
        echo "S'inscrire </button>";
        echo '<button class="header--button--login">';
        echo 'Se connecter </button>';
        echo '</div>';
    } ?>
</div>
<script src="<?php echo HOST_JS . '/scriptHeader.js' ?>"></script>