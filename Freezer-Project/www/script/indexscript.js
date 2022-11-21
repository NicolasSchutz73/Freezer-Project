function create(tagName, container, text = null, classs = null, id = null) {
    let element = document.createElement(tagName)
    container.appendChild(element)
    if (text)
        element.appendChild(document.createTextNode(text))
    if (classs)
        element.classList.add(classs)
    if (id)
        element.id = id
    return element
}

let idMusicForm = document.getElementById("idMusicForm")
let playlistForm = document.querySelector(".formPlaylist")
let fieldset = document.querySelector("fieldset")

/*Affichage Playlists*/
let dataContainer = document.querySelector("#dataContainer")

axios.get("crud/getallplaylists.php")
    .then(function (response) {
        let playlists = response.data
        affichePlaylists(playlists)
    })


axios.get("crud/getallmusics.php")
    .then(function (response) {
        let musics = response.data
        afficheMusiques(musics);
    })

function afficheMusiques(musiques) {
    //Container
    let musiquesContainer = create("div", dataContainer, null, "musiquesPlaylist");
    create("p", musiquesContainer, "Liste des musiques :", "label");

    for (musique of musiques) {
        //Container
        let musiqueContainer = create("div", musiquesContainer, null, "musique", musique.id);


        //Musique
        let imageMusique = create("div", musiqueContainer, null, "imageMusique");
        let image = create("img", imageMusique);
        image.src = "images/musique/" + musique.image;

        //Texte
        let texteMusique = create("div", musiqueContainer, null, "texteMusique");
        //Nom,Auteur
        let nom = create("p", texteMusique, musique.nom_music, "nomMusique");
        let auteur = create("p", texteMusique, musique.nom_artiste, "auteurMusique");
        let genre = create("span", texteMusique, musique.genre, "genreMusique");

        let button = create("button", musiqueContainer, "+", null, musique.id)

        //Bouton d'ajout d'une musique vers une playlist
        button.addEventListener("click", function () {
            idMusicForm.value = button.id
            playlistForm.style.display = "block";
        })

        imageMusique.addEventListener("click", () => {
            idMusic = musiqueContainer.getAttribute('id')
            getAudiofromData(0, idMusic)
            count = startMusicNextPrevious(count)
            // audio.src = "musiques/" + musique.fichier
            // console.log(audio.src)
        })

    }
}

//ATTENTION ! LES CLASSES NE SONT PAS A JOUR !
//CEST UN COPIER COLLER DE LA FONCTION AFFICHEMUSIQUES JUSTE POUR QUE CA SOIT MOINS MOCHE

function affichePlaylists(playlists) {
    //Container
    let playlistsContainer = create("div", dataContainer, null, "musiquesPlaylist");
    create("p", playlistsContainer, "Liste des playlists :", "label");

    for (playlist of playlists) {
        //Container
        let playlistContainer = create("div", playlistsContainer, null, "musique");

        //Musique
        let imagePlaylist = create("div", playlistContainer, null, "imageMusique");
        let image = create("img", imagePlaylist);
        image.src = "images/playlist/" + playlist.image;

        //Texte
        let textePlaylist = create("div", playlistContainer, null, "texteMusique");
        //Nom,Auteur
        let playlistlink = create("a", textePlaylist, playlist.nom, "nomMusique");
        playlistlink.href = "components/playlist2.php?pl=" + playlist.hashlink;
        let auteur = create("p", textePlaylist, playlist.auteur, "auteurMusique");

        //formulaire
        create("label", fieldset, playlist.nom + " : ")
        let inputRadio = create("input", fieldset)
        inputRadio.type = "radio"
        inputRadio.name = "formPlaylist"
        inputRadio.value = playlist.id
        create("br", fieldset)
    }
}

let addButton = document.querySelector(".formPlaylist button")
addButton.addEventListener("click", function () {
    var ele = document.getElementsByName('formPlaylist');
    for (i = 0; i < ele.length; i++) {
        if (ele[i].checked)
            var idPlaylist = ele[i].value
    }
    if (idMusicForm != "none") {
        axios.get("crud/addmusicpl.php?idpl=" + idPlaylist + "&idmusic=" + idMusicForm.value
        ).then(function (response) {
            console.log(response)
        })
    }
    playlistForm.style.display = "none"
})

