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

/*Affichage Playlist*/

let body = document.querySelector("main")
var hashlink = document.getElementById("hashlink").value;

//Recup données de la playlist
axios.get("crud/getplaylist.php?pl=" + hashlink)
    .then(function (response) {
        let playlist = response.data[0];
        if (typeof (playlist) == "undefined") {
            let message = create("p", body, "Désolé, cette playlist n'existe pas :/");
        } else {
            //Affichage

            //Infos Playlist
            afficheInfos(playlist);

            //Musiques de la playlist
            if (playlist.musiques != "") {
                axios.get("crud/getmusiquesplaylist.php?id=" + playlist.musiques)
                    .then(function (response) {
                        let musiques = response.data;
                        afficheMusiques(musiques);
                    })
            } else {
                let message = create("p", body, "Cette playlist ne contient pas de musiques !");
            }
        }
    })

/*Fonctions affichage*/

function afficheInfos(pl) {
    //Container
    let infosPlaylistContainer = create("div", body, null, "infosPlaylist");
    //Image
    let imagePlaylist = create("div", infosPlaylistContainer, null, "imagePlaylist");
    let image = create("img", imagePlaylist);
    image.src = "images/playlist/" + pl.image;
    //Texte
    let texteInfoContainer = create("div", infosPlaylistContainer, null, "texteInfoPlaylist");
    //Nom,auteur
    let nom = create("p", texteInfoContainer, pl.nom, "nomPlaylist");
    let auteur = create("p", texteInfoContainer, "Playlist créée par " + pl.auteur, "auteurPlaylist");
}


function afficheMusiques(musiques) {
    //Container
    let musiquesContainer = create("div", body, null, "musiquesPlaylist");
    create("p", musiquesContainer, "Liste des musiques :", "label");

    for (musique of musiques) {
        //Container
        let musiqueContainer = create("div", musiquesContainer, null, "musique", musique.id);
        musiqueContainer.addEventListener("click", () => {
            idMusic = musiqueContainer.getAttribute('id')
            getAudiofromData(0, idMusic)
            count = startMusicNextPrevious(count)
            // audio.src = "musiques/" + musique.fichier
            // console.log(audio.src)
        })

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

        imageMusique.addEventListener("click", () => {
            idMusic = musiqueContainer.getAttribute('id')
            getAudiofromData(0, idMusic)
            count = startMusicNextPrevious(count)
            // audio.src = "musiques/" + musique.fichier
            // console.log(audio.src)
        })
    }
}
