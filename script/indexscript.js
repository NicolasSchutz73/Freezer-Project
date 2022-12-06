//Function pour récupérer l'url courante et son paramètre
function getUrl() {
    var str = window.location.href
    var url = new URL(str)
    var page = url.searchParams.get("page")

    return page;
}

let buttonAdmin = document.querySelector(".header--button--signUp")
var testAdmin = false


console.log(document.querySelector("#titreLike"))
document.querySelector("#titreLike").addEventListener("click",()=>{
    //Changement d'url
    window.history.replaceState(stateObj,
        "like", "?page=like");

    //vide le musique container
    removeAllChild(musiquesContainer)
    //vide le playlist container
    removeAllChild(playlistsContainer)
    //vide le user container
    removeAllChild(usersContainer)
    //affiche titre liké
    afficheTitrelike()
})

    


// si document.querySelector(".header--button--signUp") existe
if (document.querySelector(".header--button--Admin")) {
    let buttonAdmin = document.querySelector(".header--button--Admin")
    buttonAdmin.addEventListener("click", function () {
        //passe testAdmin a true
        testAdmin = true
        //vide le musique container
        removeAllChild(musiquesContainer)
        //vide le playlist container
        removeAllChild(playlistsContainer)
        //vide le user container
        removeAllChild(usersContainer)
        //affiche les musiques
        afficheMusiques(jsonMusiques[0])
        //affiche les users
        afficheUsers(jsonUsers[0])
    })
}


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


//Conteneurs
let playlistsContainer = document.querySelector("#playlistsContainer")
let body = document.querySelector("main")
let musiquesContainer = document.querySelector("#musiquesContainer")
let usersContainer = document.querySelector("#usersContainer")
let accueilButton = document.querySelector("#accueil")
var stateObj = { id: "100" };




//variables globales
let jsonMusiques = []
//initialisation jsonMusiques
axios.get("crud/getallmusics.php?search=null")
    .then(function (response) {
        jsonMusiques.push(response.data)
    })
let jsonPlay = []
let pagePlaylist = false
let idsPlaylist = ''

chercheMusic()
cherchePlaylist()

accueilButton.addEventListener("click", ()=> {
    pagePlaylist = false
    window.history.replaceState(stateObj,
        "accueil", "?page=accueil");

    //reinitialisation jsonMusiques
    axios.get("crud/getallmusics.php?search=null")
        .then(function (response) {
            jsonMusiques = []
            jsonMusiques.push(response.data)
        })

    chercheMusic()
    cherchePlaylist()

    //retirer le bouton delete
    testAdmin = false
    buttonDelete = document.querySelector(".buttonDelete")
    if (buttonDelete) {
        buttonDelete.remove()
    }

    removeAllChild(usersContainer)
})


/*------------------------AFFICHE MUSIQUES------------------------------*/

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
            addMusicToPlaylist(button.id)
        })

        //Bouton de suppression d'une musique si admin
        if (testAdmin) {
            let buttonDelete = create("button", musiqueContainer, "-", "buttonDelete", musique.id)
            buttonDelete.addEventListener("click", function () {
                deleteMusic(buttonDelete.id)
            })
        }

        imageMusique.addEventListener("click", () => {
            jsonPlay = jsonMusiques 
            axios.get("config/save.php?tab=" + jsonMusiques)
            idMusic = musiqueContainer.getAttribute('id')
            getAudiofromData(idMusic - 1)
            count = startMusicNextPrevious(count)
        })

    }
}




/*------------------------AFFICHE PLAYLIST------------------------------*/




function affichePlaylists(playlists) {
    //Container
    create("p", playlistsContainer, "Liste des playlists :", "label");
    let playlistsContainerWrap = create("div", playlistsContainer, null, "playlistsContainerWrap")

    for (playlist of playlists) {
        //Container
        let playlistLink = create("div", playlistsContainerWrap, null, null, playlist.hashlink)

        playlistLink.addEventListener("click", function () {
            window.history.replaceState(stateObj,
                "playlist", "?page=" + playlistLink.id)



            axios.get("crud/getplaylist.php?pl=" + getUrl())
                .then(function (response) {
                    let playlistDatas = response.data[0];
                    pagePlaylist = true
                    idsPlaylist = playlistDatas.musiques

                    //Mise a jour jsonMusiques
                    axios.get("crud/getmusiquesplaylist.php?id=" + idsPlaylist + "&search=null")
                        .then(function (response) {
                            jsonMusiques = []
                            jsonMusiques.push(response.data)
                        })

                    afficheInfosPlaylist(playlistDatas)
                    chercheMusic()
                    /*
                    axios.get("crud/getmusiquesplaylist.php?id="+ playlistDatas.musiques+"&search=null")
                    .then(function (response) {
                            let musiques = response.data;
                            removeAllChild(musiquesContainer);
                            afficheMusiques(musiques);
                    })
                    */

                })
        })

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

    }
}

function afficheInfosPlaylist(pl) {
    //Container
    removeAllChild(playlistsContainer)
    let infosPlaylistContainer = create("div", playlistsContainer, null, "infosPlaylist");
    //Image
    let imagePlaylist = create("div", infosPlaylistContainer, null, "imagePlaylist");
    let image = create("img", imagePlaylist);
    image.src = "images/playlist/" + pl.image;
    //Texte
    let texteInfoContainer = create("div", infosPlaylistContainer, null, "texteInfoPlaylist");
    //Nom,auteur
    create("p", texteInfoContainer, pl.nom, "nomPlaylist");
    create("p", texteInfoContainer, "Playlist créée par " + pl.auteur, "auteurPlaylist");
}


/*------------------------AFFICHE USERS------------------------------*/

//récupère info utilisateur
let jsonUsers = []
//initialisation jsonUsers
axios.get("crud/getallusers.php")
    .then(function (response) {
        jsonUsers.push(response.data)
        console.log(jsonUsers)
    })

//affiche users
function afficheUsers(users) {
    //Container
    create("p", usersContainer, "Liste des utilisateurs :", "label");

    for (user of users) {
        //Container
        let userContainer = create("div", usersContainer, null, "user", user.id);

        //Texte
        let texteUser = create("div", userContainer, null, "texteUser");

        //id,login,mail
        create("p", texteUser, user.id, "idUser");
        create("p", texteUser, user.login, "loginUser");
        create("span", texteUser, user.email, "emailUser");

        //Bouton de suppression d'une musique si admin
        if (testAdmin) {
            let buttonDeleteUser = create("button", userContainer, "-", "buttonDelete", user.id)
            buttonDeleteUser.addEventListener("click", function () {
                deleteUser(buttonDeleteUser.id)
            })
        }
    }
}
function deleteUser(id) {
    axios.get("crud/deleteUser.php?id=" + id).then(function (response) {
        let users = response.data;
        removeAllChild(usersContainer);
        afficheUsers(users);
    })
}

/*------------------------AFFICHE TITRE LIKE------------------------------*/

function afficheTitrelike(){
    axios.get("crud/getMusicLiked.php").then(function (response){
        let infosPlaylistContainer = create("div", playlistsContainer, null, "infosPlaylist");
        //Image
        let imagePlaylist = create("div", infosPlaylistContainer, null, "imagePlaylist");
        let image = create("img", imagePlaylist);
        image.src = "images/playlist/titreLiked.png";
        //Texte
        let texteInfoContainer = create("div", infosPlaylistContainer, null, "texteInfoPlaylist");
        //Nom,auteur
        create("p", texteInfoContainer, "Titre likés", "nomPlaylist");
        create("p", texteInfoContainer, "Les musiques que vous aimez ", "auteurPlaylist");
        
        let idmusiques = response.data[0].musiques
        
        if(idmusiques !== "NULL" && idmusiques !== "" && idmusiques !== undefined){
            axios.get("crud/getmusiquesplaylist.php?id=" + idmusiques + "&search=null").then(function(response) {
                jsonMusiques = []
                jsonMusiques.push(response.data)
                let musiques = response.data;
                afficheMusiques(musiques);
            })
        }
        else{

            let message = create("p", musiquesContainer, "Cette playlist ne contient pas de musiques !");
            
        }
        

    })
}
