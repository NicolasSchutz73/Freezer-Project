<!-- FOOTER -->
<footer>
    <audio src="#">Musique</audio>
    <div id="barAudio">
        <div id="conteneurButtonAudio">
            <div id="buttonAudio">
                <i class="fa-solid fa-shuffle" id="buttonRandom"></i>
                <i class="fa-solid fa-backward-step" id="buttonPrevious"></i>
                <i class="fa-solid fa-play" id="buttonPause"></i>
                <i class="fa-solid fa-forward-step" id="buttonNext"></i>
                <i class="fa-solid fa-repeat" id="buttonRepeat"></i>
            </div>
        </div>
        <div id="Music">
            <img id="imgMusic" src="<?php echo HOST_IMG . '/footer/iconeMusique.jpg'; ?>" alt="#">
            <div id="infoMusic">
                <h2></h2>
                <p></p>
            </div>
<<<<<<< HEAD
            <i id="likeMusic"></i>
=======

            <?php
            if (isset($_SESSION['id'])) {
                echo '<button><i class="fa-regular fa-heart" id="like"></i></button>';
            } else {
                echo '<button disabled><i class="fa-regular fa-heart" id="likeDisable"></i></button>';
            } ?>

>>>>>>> fd5d475ffb8e20185e73c58d9e21f328f0cff0c8
        </div>
        <div id="conteneurTimeBar">
            <div id="timeBar">
                <p id="affichageTime">0:00</p>
                <input type="range" id="timeSlider" min="0" max="100" value="0" step="1">
                <p id="timeFinalAudio"></p>
            </div>
        </div>
        <div id="volume">
            <img src="<?php echo HOST_IMG . '/footer/volume.png'; ?>" alt="icon volume" id="iconVolume">
            <input type="range" id="volumeSlider" min="0" max="100" value="50" step="1">
        </div>
    </div>
</footer>
<!-- /FOOTER -->

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="<?php echo HOST_JS . '/scriptFooter.js' ?>"></script>
</body>

</html>