<?php
include '../init.php';
?>

<?php require_once (ROOT_DIR . '/components/header.php') ?>
<!-- <link rel="stylesheet" href="../style/playlist.css"> -->

<?php require_once (ROOT_DIR . '/components/sidebar.php') ?>

<input type=hidden id=hashlink value=<?php echo ($_GET["pl"]); ?> />

<main>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="../script/playlistscript.js" defer></script>
</main>

</body>
</html>