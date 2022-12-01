<!-- MAIN -->
<main>
    <div id="playlistsContainer">
    </div>

    <div id="musiquesContainer">
    </div>
    <div class="formPlaylist">
        <p>A quel playlist souhaitez vous ajouter cette musique ?</p>
        <input type="hidden" id="idMusicForm" value="none">
        <fieldset>
        </fieldset>
        <button>Ajouter</button>
    </div>

    <?php require_once(ROOT_DIR . '/components/addToPlaylist.php') ?>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="<?php echo HOST_JS . '/indexscript.js' ?>"></script>
    <script src="<?php echo HOST_JS . '/formulairesscript.js' ?>"></script>
</main>
<!-- /MAIN -->