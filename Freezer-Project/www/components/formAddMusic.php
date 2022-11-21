<!-- FORM-ADD-MUSIC -->
<style>
    .wrapper {
        padding: 60px 0 11px 230px;
        max-height: 100vh;
        min-height: 100vh;
        overflow-y: auto;
        background-color: rgb(18, 18, 18);
        color: white;
        font-weight: 700;
    }
</style>
<div class='wrapper'>
    <h1>Ajouter Musique</h1>
    <section>
        <form action='../crud/addMusicDB.php' method='POST' enctype="multipart/form-data">
            <input type='text' name='Titre' id='Titre' placeholder='Titre' maxlength=100>
            <input type='text' name='Artiste' id='Artiste' placeholder='Artiste' maxlength=100>
            <input type='text' name='Genre' id='Genre' placeholder='Genre' maxlength=100>
            <div class='Image'>
                <label for='image'>Image :</label>
                <input type='file' name='image' id='Image' accept='.png' size='100'>
            </div>
            <div class='Music'>
                <label for='music'>Music :</label>
                <input type='file' name='music' id='Music' accept='.mp3' size='100'>
            </div>
            <input type='submit' value='Ajouter la musique' id='send'>
        </form>
    </section>
</div>