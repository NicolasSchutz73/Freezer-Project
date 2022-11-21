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
let playlistsContainer = document.querySelector("#playlistsContainer")
let musiquesContainer = document.querySelector("#musiquesContainer")

chercheMusic()
cherchePlaylist()


function afficheMusiques(musiques) {
    //Container
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

        //Nom,Auteur,Genre
        create("p", texteMusique, musique.nom_music, "nomMusique");
        create("p", texteMusique, musique.nom_artiste, "auteurMusique");
        create("span", texteMusique, musique.genre, "genreMusique");

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
    create("p", playlistsContainer, "Liste des playlists :", "label");
    let playlistsContainerWrap = create("div", playlistsContainer, null, "playlistsContainerWrap")

    for (playlist of playlists) {
        //Container
        let playlistLink = create("a", playlistsContainerWrap)
        playlistLink.href = "components/playlist.php?pl=" + playlist.hashlink;
        let playlistContainer = create("div", playlistLink, null, "playlistIndex");

        //Image
        let imagePlaylist = create("a", playlistContainer, null, "imagePlaylistWrap");
        let image = create("img", imagePlaylist);
        image.src = "images/playlist/" + playlist.image;

        //Texte
        let textePlaylist = create("div", playlistContainer, null, "textePlaylist");
        //Nom,Auteur
        create("p", textePlaylist, playlist.nom, "nomPlaylistIndex");
        create("p", textePlaylist, "Par : " + playlist.auteur, "auteurPlaylistIndex");

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

