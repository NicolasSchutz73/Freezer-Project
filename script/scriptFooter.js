////////////////////////////////////////////////////////////////////////////
///////////////////////     VARIABLES       ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

//variable conteneur 
var footer = document.querySelector('footer')

//variable pour l'audio
var audio = document.querySelector("audio");
var TimeAudio = document.querySelector("#borderTimeBar")
var ControlTimeAudio = document.querySelector("#controllTimeBar")
var affichageTimeAudio = document.querySelector("#affichageTime")
var timeSlider = document.querySelector("#timeSlider")


//variable pour les info
var titre = document.querySelector("#infoMusic h2")
var imgMusic = document.querySelector("#imgMusic")
var artiste = document.querySelector("#infoMusic p")
var imgMusic = document.querySelector("#imgMusic")
var like = document.querySelector("#likeMusic")

//variable pour les boutons
var buttonPause = document.querySelector("#buttonPause")
var buttonNext = document.querySelector("#buttonNext")
var buttonPrevious = document.querySelector("#buttonPrevious")
var buttonRepeat = document.querySelector("#buttonRepeat")
var buttonRandom = document.querySelector("#buttonRandom")
var buttonFullScreen = document.querySelector("#fullScreenButton")


//variables secondaire
var pub = 0
var count = 1
var isRandom = false
var isLiked = false
var idData;



//////////////////////////////////////////////////////////////////////////
///////////////////////     EVENEMENTS    ///////////////////////////////
//////////////////////////////////////////////////////////////////////////






// Quand l'utilisateur clique sur le bouton pause le bouton devient play
buttonPause.addEventListener("click", () => {
    buttonPlayPause(count)
    count++

})


// QUAND l'utilisateur clique sur le bouton random, on mélange notre tableau de musique
buttonRandom.addEventListener("click", () => {
    randomButton(isRandom)

})


// QUAND l'utilisateur clique sur le bouton suivant
buttonNext.addEventListener("click", () => {
    nextMusic();
})

// QUAND l'utilisateur clique sur le bouton précédant
buttonPrevious.addEventListener("click", () => {
    if (idData > 0) { idData-- }
    getAudiofromData(idData,true)
    count = startMusicNextPrevious(count)
})

// Quand l'utilisateur clique sur le bouton REPETER
buttonRepeat.addEventListener("click", () => {
    repeatButton()
})

// Quand l'audio est fini
audio.addEventListener("ended", () => {
    nextMusic()
})


like.addEventListener("click", () => {
    likeButton(isLiked);
})


// BARRE D'AUDIO// 
var volumeSlider = document.querySelector("#volumeSlider");


volumeSlider.addEventListener("change", function () {
    audio.volume = volumeSlider.value / 100
})


// FULL SCREEN 
buttonFullScreen.addEventListener("click",() =>{
    afficheFullScreen();
})


//BARRE CONTROLE TEMPS AUDIO //
audio.addEventListener("timeupdate", function () {
    let posBarre = audio.currentTime / audio.duration
    timeSlider.value = posBarre * 100
    // AFFICHAGE DU TEMPS DE L AUDIO // 
    affichageTimeAudio.innerHTML = convertSecond(audio.currentTime)
    document.querySelector("#timeFinalAudio").innerHTML = convertSecond(audio.duration)


})
timeSlider.addEventListener("input", () => {
    audio.currentTime = (timeSlider.value * audio.duration) / 100
})















//////////////////////////////////////////////////////////////////////////////
////////////////////////     FUNCTIONS        ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////

    
//Function récupérer audio, image et artiste
function getAudiofromData(idDonne,previousnext=false) {

    if(previousnext===false){
        for(let i = 0; i < jsonPlay[0].length; i ++){
            if(jsonPlay[0][i].id == idDonne + 1){
                var linkAudio = jsonPlay[0][i].fichier
                var titreAudio = jsonPlay[0][i].nom_music
                var artisteAudio = jsonPlay[0][i].nom_artiste
                var image = jsonPlay[0][i].image
                idData = i
            }
        }
    }
    else{
        var linkAudio = jsonPlay[0][idDonne].fichier
        var titreAudio = jsonPlay[0][idDonne].nom_music
        var artisteAudio = jsonPlay[0][idDonne].nom_artiste
        var image = jsonPlay[0][idDonne].image
        idData = idDonne
    }

    audio.src = "musiques/" + linkAudio
    titre.innerHTML = titreAudio
    artiste.innerHTML = artisteAudio
    imgMusic.src = "images/musique/" + image
    like.classList.add("fa-regular")
    like.classList.add("fa-heart")



    axios.get("crud/musicLiked.php?idMusic=" +idDonne).
    then(function(response){
        if(response.data != 1){
            if(isLiked == true){
                like.classList.remove("fa-solid")
                like.classList.add("fa-regular")
                like.classList.add("fa-heart")
                isLiked = false;
            }
        }
        else{
            if(isLiked == false){
                like.classList.remove("fa-regular")
                like.classList.add("fa-solid")
                like.classList.add("fa-heart")
                isLiked = true;
            }

        }
    })

    
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

    let nbMusic = jsonPlay[0].length
    // Si le bouton random est appuyé alors on lance une musique aléatoire 
    if (isRandom) {
        idData = randomIdData(idData, nbMusic)
        getAudiofromData(idData,true)
        audio.setAttribute("autoplay", "")
        count = startMusicNextPrevious(count)
    }
    //Sinon on prend la musique suivante
    else {
        if (idData + 1 < nbMusic) { idData++ }
        getAudiofromData(idData,true)
        audio.setAttribute("autoplay", "")
        count = startMusicNextPrevious(count)
    }
}

//Function qui lance ma musique quand on appuie sur le bouton suivant et précédant
function startMusicNextPrevious(count) {
    pub ++;
    audio.setAttribute("autoplay", "")
    buttonPause.classList = "fa-solid fa-pause"

    if (count % 2 != 0) {
        count++

    }
    return count
}


//Function bouton répéter 
function repeatButton() {
    if (audio.hasAttribute('loop')) {
        audio.removeAttribute('loop')
        buttonRepeat.style.color = 'white'
    }
    else {
        audio.setAttribute("loop", "")
        buttonRepeat.style.color = 'purple'
    }
}

// Function Bouton Random 
function randomButton(etat) {
    if (etat == false) {
        etat = true
        buttonRandom.style.color = "purple"
    }
    else {
        etat = false
        buttonRandom.style.color = "white"
    }

    isRandom = etat
}


//FUNCTION MUSIQUE RANDOM
function randomIdData(idData, taille) {
    nb = getRandomInt(taille)
    while (nb == idData) {
        nb = getRandomInt(taille)
    }
    idData = nb
    return idData
}

//Function BoutonLike 
function likeButton(etat) {
    if (etat == false) {
        etat = true
        like.className = "fa-solid fa-heart"
        axios.get("crud/addMusicLiked.php?idMusic=" +jsonPlay[0][idData].id)
        setTimeout(()=>{
            if(getUrl() === 'like'){    
                     //vide le musique container
                    removeAllChild(musiquesContainer)
                    //vide le playlist container
                    removeAllChild(playlistsContainer)
                    //vide le user container
                    removeAllChild(usersContainer)
                    //affiche titre liké
                    afficheTitrelike()
                }},100)
    }
    else {
        etat = false
        like.className = "fa-regular fa-heart"
        axios.get("crud/removeMusicLiked.php?idMusic="+ jsonPlay[0][idData].id)
        if(getUrl() === 'like'){    
            idMusicDelete = document.getElementById(jsonMusiques[0][idData].id)
            idMusicDelete.remove()
            if((jsonMusiques[0].length == 1)){
                let message = create("p", body, "Cette playlist ne contient pas de musiques !");
            }
        }
    }
    /* ??
        setTimeout(()=>{
        if(getUrl() === 'like'){    
                 //vide le musique container
                removeAllChild(musiquesContainer)
                //vide le playlist container
                removeAllChild(playlistsContainer)
                //vide le user container
                removeAllChild(usersContainer)
                //affiche titre liké
                afficheTitrelike()
            }},100)

        }
*/
    isLiked = etat
}

function afficheFullScreen(){
    footer.classList.toggle("containerFullScreen")
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
        res = hour + ":" + min + ":" + sec
    }
    else {
        res = min + ":" + sec;
    }
    return res;
}
