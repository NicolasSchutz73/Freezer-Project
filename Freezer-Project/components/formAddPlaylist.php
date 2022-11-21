<!-- FORM-PLAYLIST -->
<style>
    #formPlaylist {
        padding: 60px 0 11px 230px;
        max-height: 100vh;
        min-height: 100vh;
        overflow-y: auto;
        background-color: rgb(18, 18, 18);
        color: white;
        font-weight: 700;
    }
</style>
<form method="post" enctype="multipart/form-data" id="formPlaylist">
    <h3>Nouvelle Playlist</h3>

    <label>Nom :</label><br>
    <input type="text" name="nom"><br>
    
    <label>Image : </label><br>
    <input type="file" name="image" accept="image/png, image/jpeg"><br>
    <input type="submit" name="submit" value="Envoyer le fichier" />
</form>
<!-- /FORM-PLAYLIST -->
<?php
if (isset($_POST["nom"]) &&
isset($_POST["submit"]) &&
!empty($_FILES["image"]['name']))
{
    include("../crud/createplaylist.php");
    add_playlist($_POST['nom'],"utilisateur",$_FILES["image"]);
}
?>