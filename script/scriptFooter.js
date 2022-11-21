////////////////////////////////////////////////////////////////////////////
///////////////////////     VARIABLES       ///////////////////////////////
///////////////////////////////////////////////////////////////////////////


//variable pour l'audio
var audio = document.querySelector("audio");
var TimeAudio = document.querySelector("#borderTimeBar")
var ControlTimeAudio = document.querySelector("#controllTimeBar")
var affichageTimeAudio = document.querySelector("#affichageTime")



//variable pour les info
var titre = document.querySelector("#infoMusic h2")
var imgMusic = document.querySelector("#imgMusic")
var artiste = document.querySelector("#infoMusic p")
var imgMusic = document.querySelector("#imgMusic")

//variable pour les boutons
var buttonPause = document.querySelector("#buttonPause")
var buttonNext = document.querySelector("#buttonNext")
var buttonPrevious = document.querySelector("#buttonPrevious")
var buttonRepeat = document.querySelector("#buttonRepeat")
var buttonRandom = document.querySelector("#buttonRandom")

//variables secondaire
var count = 1
var isRandom = false




//////////////////////////////////////////////////////////////////////////
///////////////////////     EVENEMENTS    ///////////////////////////////
//////////////////////////////////////////////////////////////////////////



var idData;


// Quand l'utilisateur clique sur le bouton pause le bouton devient play
buttonPause.addEventListener("click", () => {
    buttonPlayPause(count)
    count++

})


// QUAND l'utilisateur clique sur le bouton random, on mélange notre tableau de musique
buttonRandom.addEventListener("click", () => {
    isRandom = true
})


// QUAND l'utilisateur clique sur le bouton suivant
buttonNext.addEventListener("click", () => {
    nextMusic();
})

// QUAND l'utilisateur clique sur le bouton précédant
buttonPrevious.addEventListener("click", () => {
    if (idData > 0) { idData-- }
    getAudiofromData(idData)
    count = startMusicNextPrevious(count)
})

// Quand l'utilisateur clique sur le bouton REPETER
buttonRepeat.addEventListener("click", () => {
    audio.setAttribute("loop", "")
})

// Quand l'audio est fini
audio.addEventListener("ended", () => {
    nextMusic()
})


// BARRE D'AUDIO// 
var volumeSlider = document.querySelector("#volumeSlider");


volumeSlider.addEventListener("change", function () {
    audio.volume = volumeSlider.value / 100
})


//BARRE CONTROLE TEMPS AUDIO //
audio.addEventListener("timeupdate", function () {
    let posBarre = audio.currentTime / audio.duration
    ControlTimeAudio.style.width = posBarre * 100 + '%'
    // AFFICHAGE DU TEMPS DE L AUDIO // 
    affichageTimeAudio.innerHTML = convertSecond(audio.currentTime)
    document.querySelector("#timeFinalAudio").innerHTML = convertSecond(audio.duration)

    rect = TimeAudio.getBoundingClientRect();
    largeurTimeAudio = rect.width;
})



TimeAudio.addEventListener("click", function (e) {
    let x = ((e.clientX - rect.left) * 100) / largeurTimeAudio;
    let TimeAudio = (x * audio.duration) / 100;
    audio.currentTime = TimeAudio;
})















/////////////////////////////////////////////////////////////////////////////
///////////////////////     FUNCTIONS        ///////////////////////////////
////////////////////////////////////////////////////////////////////////////




//Function récupérer audio, image et artiste
function getAudiofromData(idDonne, idMusique = null) {
    axios.get("config/data.php").then(response => {
        if (idMusique != null) {
            for (music of response.data) {
                if (music.idMusic == idMusique) {
                    idDonne = music.idData
                    idData = idDonne
                }
            }
        }

        var linkAudio = response.data[idDonne].musique
        var titreAudio = response.data[idDonne].titre
        var artisteAudio = response.data[idDonne].artiste
        var image = response.data[idDonne].image

        audio.src = "musiques/" + linkAudio
        titre.innerHTML = titreAudio
        artiste.innerHTML = artisteAudio
        imgMusic.src = "images/musique/" + image
    })


}

//Function pour récupérer le nombre de music dans le ficher data.json
function getNbMusicofData() {
    tailleMusic = axios.get("config/data.php").then(response => {
        return response.data.length
    })

    return tailleMusic
}


//Function bouton PAUSE-PLAY
function buttonPlayPause(count) {
    if (count % 2 == 0) {
        buttonPause.classList = "fa-solid fa-play"
        audio.pause()
    }
    else {
        buttonPause.classList = "fa-solid fa-pause"
        audio.play()
    }
}

//Function music Suivante
function nextMusic() {
    axios.get("config/data.php").then(response => {
        let nbMusic = response.data.length

        // Si le bouton random est appuyé alors on lance une musique aléatoire 
        if (isRandom) {
            idData = randomIdData(idData, nbMusic)
            getAudiofromData(idData)
            audio.setAttribute("autoplay", "")
            count = startMusicNextPrevious(count)
        }
        //Sinon on prend la musique suivante
        else {
            if (idData + 1 < nbMusic) { idData++ }
            getAudiofromData(idData)
            audio.setAttribute("autoplay", "")
            count = startMusicNextPrevious(count)
        }
    })

}

//Function qui lance ma musique quand on appuie sur le bouton suivant et précédant
function startMusicNextPrevious(count) {
    audio.setAttribute("autoplay", "")
    buttonPause.classList = "fa-solid fa-pause"

    if (count % 2 != 0) {
        count++

    }
    return count
}

//FUNCTION BOUTON RANDOM
function randomIdData(idData, taille) {
    nb = getRandomInt(taille)
    while (nb == idData) {
        nb = getRandomInt(taille)
    }
    idData = nb
    return idData
}


// FUNCTION RANDOM
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


//FUNCTION QUI CONVERTIE LES SECONDES// 

function convertSecond(time) {
    if (time < 3600) {
        var hour = 0
        var min = ~~(time / 60)
        var sec = ~~(time % 60)
    }
    else {
        var hour = ~~(time / 3600)
        var min = ~~((time % 3600) / 60)
        var sec = ~~((time % 3600) % 60)
    }

    // Ajout d'un zéro devant les unités si elles ont pas de dizaine
    hour = hour < 10 ? "0" + hour : hour
    min = min < 10 ? "0" + min : min
    sec = sec < 10 ? "0" + sec : sec

    if (hour > 0) {
        TimeAudio.style.left = 37 + "%"
        res = hour + ":" + min + ":" + sec
    }
    else {
        res = min + ":" + sec;
        TimeAudio.style.left = 35 + "%"
    }
    return res;
}
