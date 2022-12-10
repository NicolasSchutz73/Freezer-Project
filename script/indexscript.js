//Fonction create
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
let main = document.querySelector("main")
var stateObj = { id: "100" };

//variables globales
let testAdmin = false;
let idSession = getIdSession()
let jsonMusiques = []
let jsonPlay = []
let page = ""
let idsPlaylist = ''

//Function pour récupérer l'url courante et son paramètre
function getUrl() {
    var str = window.location.href
    var url = new URL(str)
    var pg = url.searchParams.get("page")
    //Si on est pas sur une page, redirige vers l'accueil
    if (pg == null) {
        window.history.replaceState(stateObj, "accueil", "?page=accueil");
        pg = "accueil"
    }
    return pg;
}

//Renvoie l'id de la session, null si pas connecté, met a jour testadmin
function getIdSession() {
    var user = document.getElementsByClassName("header--button--user")
    if (user[0] == undefined) {
        var idSession = null
    } else {
        var idSession = user[0].id
        if (idSession == 1000) {
            testAdmin = true;
        }
    }
    return idSession
}

/*------------------------LOAD PAGE------------------------------*/
//en fonction de l'url



function loadPage(url) {

    //page accueil
    if (url == "accueil") {
        page = url

        //Reset
        jsonMusiques = []
        removeAllChild(main)

        //Container playlist
        create("p", main, "Liste des playlists :", "label");
        let playlistsContainer = create("div", main, null, null, "playlistsContainer")
        create("div", playlistsContainer, null, "playlistsContainerWrap")

        //Container musique
        create("p", main, "Liste des musiques :", "label");
        create("div", main, null, null, "musiquesContainer")

        createFormulairePopup()

        //initialisation jsonMusiques
        axios.get("crud/getallmusics.php?search=null")
            .then(function (response) {
                jsonMusiques.push(response.data)
            })

        cherchePlaylist()
        chercheMusic()



        //page like
    } else if (url == "like") {
        page = url
        removeAllChild(main)
        createFormulairePopup()

        //Si pas connecté
        if (idSession == null) {
            //Si pas connecté
            if (getUrl() != "accueil") {
                window.history.replaceState(stateObj,
                    "accueil", "?page=accueil");
                loadPage(getUrl())
            }

        } else {

            //page like
            playlistsContainer = create("div", main, null, null, "playlistsContainer")
            create("p", main, "Liste des musiques :", "label");
            musiquesContainer = create("div", main, null, null, "musiquesContainer")
            afficheTitreliké()


        }


        //page playlist (12 car longueur du hashlink)
    } else if (url.length == 12) {
        page = "playlist"
        console.log(page)

        axios.get("crud/getplaylist.php?pl=" + url)
            .then(function (response) {
                let playlistDatas = response.data[0];
                idsPlaylist = playlistDatas.musiques

                //Mise a jour jsonMusiques
                axios.get("crud/getmusiquesplaylist.php?id=" + idsPlaylist + "&search=null")
                    .then(function (response) {
                        jsonMusiques = []
                        jsonMusiques.push(response.data)
                    })

                //Reset
                removeAllChild(main)

                //Container playlist
                playlistsContainer = create("div", main, null, null, "playlistsContainer")

                //Container musiques
                create("p", main, "Liste des musiques :", "label");
                create("div", main, null, null, "musiquesContainer")
                createFormulairePopup()

                afficheInfosPlaylist(playlistDatas)
                chercheMusic()
            })



        //page admin
    } else if (url == "admin") {
        //reset
        page = url
        removeAllChild(main)
        createFormulairePopup()

        if (testAdmin) {

            //AFFICHE PAGE ADMIN

            //containers
            create("div", main, null, null, "usersContainer")
            create("div", main, null, null, "suggestionsContainer")
            create("div", main, null, null, "playlistsContainer")
            create("div", main, null, null, "musiquesContainer")

            //affiche les musiques
            let jsonAllMusiques = []
            //initialisation jsonAllMusique
            axios.get("crud/getallmusics.php?search=null")
                .then(function (response) {
                    jsonAllMusiques = response.data;
                    afficheMusiques(jsonAllMusiques)
                })

            //récupère info utilisateur
            let jsonUsers = []
            //initialisation jsonUsers
            axios.get("crud/getallusers.php")
                .then(function (response) {
                    jsonUsers = response.data
                    afficheUsers(jsonUsers)
                })

            //récupère info suggestion
            let jsonSuggestions = []
            //initialisation jsonSuggestions
            axios.get("crud/getsuggestion.php")
                .then(function (response) {
                    jsonSuggestions.push(response.data)
                    afficheSuggestions(response.data)
                })


        } else {

            //PAGE ERREUR
            pageErreur()

        }


    }
    else if (url == "recent") {
        page = url
        removeAllChild(main)
        createFormulairePopup()
        //Si pas connecté
        if (idSession == null) {
            pageErreur()

        } else {
            let historicContainer = create("div", main, null, null, "historicContainer")
            create("p", main, "Liste des musiques :", "label");
            let musiquesContainer = create("div", main, null, null, "musiquesContainer")
            let infosHistoricContainer = create("div", historicContainer, null, "infosHistoric");
            //Texte
            let texteHistoricContainer = create("div", infosHistoricContainer, null, "texteInfoHistoric");
            //Nom,auteur
            create("p", texteHistoricContainer, "Historique", "nomPlaylist");
            create("p", texteHistoricContainer, "Les musiques que vous avez écouté ", "auteurHistoric");
            listenrecently()
        }
    }
    else if (url == "recommandations") {
        page = url
        removeAllChild(main)
        createFormulairePopup()
        //Si pas connecté
        if (idSession == null) {
            pageErreur()

        } else {
            let recommandationContainer = create("div", main, null, null, "recommandationContainer")
            let musiqueContainer = create("div", main, null, null, "musiquesContainer")
            create("p", musiqueContainer, "Liste des recommandations :", "label");
            let infosRecommandationContainer = create("div", recommandationContainer, null, "infosRecommandation");
            //Texte
            let texteRecommandationContainer = create("div", infosRecommandationContainer, null, "texteInfoRecommandation");
            //Nom,auteur
            create("p", texteRecommandationContainer, "Recommandations", "nomPlaylist");
            create("p", texteRecommandationContainer, "Les musiques que vous nous recommandons ! ", "auteurRecommandation");


            //affiche les musiques
            let jsonR = []
            //initialisation jsonAllMusique
            axios.get("crud/recommandation.php")
                .then(function (response) {
                    jsonR = response.data
                    afficheMusiques(jsonR)
                })
        }
    }

    //page non trouvée
    else {
        page = "error"
        console.log("???")

        removeAllChild(main)

        createFormulairePopup()
        pageErreur()
    }
}

//initialisation page
loadPage(getUrl())
loadPlaylistsSide()

//page erreur
function pageErreur() {
    let erreurContainer = create("div", main, null, "erreur-container")
    create("p", erreurContainer, "Oups ! La page que vous cherchez n'a pas été trouvée :/")
}




/*------------------------BOUTONS FORMULAIRE ET SIDE BAR------------------------------*/




//Boutton accueil
document.querySelector("#accueil").addEventListener("click", function () {
    if (getUrl() != "accueil") {
        window.history.replaceState(stateObj,
            "accueil", "?page=accueil");
        loadPage(getUrl())
        /*
        removeAllChild(usersContainer)
        removeAllChild(suggestionsContainer)
        */
    }
})
function testCo() {
    //PAS CONNECTE
    if (idSession == null) {
        //login
        document.querySelector(".header--button--login").addEventListener("click", connection)

        //sign up
        document.querySelector(".header--button--signUp").addEventListener("click", inscription)

        //suggestion
        document.querySelector("#suggestion").addEventListener("click", function () {
            openPopup("Vous devez être connecté pour suggérer des musiques")
        })

        //Ecoutées récemment
        document.querySelector("#recent").addEventListener("click", function () {
            openPopup("Vous devez être connecté pour voir votre historique")
        })

        //Formulaire playlist
        document.querySelector("#formplaylist").addEventListener("click", function () {
            openPopup("Vous devez être connecté pour créer une playlist")
        })

        //Likes
        document.querySelector("#likeplaylist").addEventListener("click", function () {
            openPopup("Vous devez être connecté voir vos like")
        })

        //Recommandations
        document.querySelector("#recommandations").addEventListener("click", function () {
            openPopup("Vous devez être connecté pour voir vos recommandations")
        })

        //CONNECTE
    } else {
        if (testAdmin) {
            document.querySelector(".header--button--user").addEventListener("click", function () {
                if (getUrl() != "admin") {
                    window.history.replaceState(stateObj,
                        "accueil", "?page=admin");
                    loadPage(getUrl())
                }
            })
        }
        //suggestion
        document.querySelector("#suggestion").addEventListener("click", suggestion)

        //Ecoutées récemment
        document.querySelector("#recent").addEventListener("click", recent)

        //Formulaire playlist
        document.querySelector("#formplaylist").addEventListener("click", createplaylist)

        //Likes
        document.querySelector("#likeplaylist").addEventListener("click", like)

        //Recommandations
        document.querySelector("#recommandations").addEventListener("click", recommandations)

        //Logout
        document.querySelector(".header--button--disconnect").addEventListener("click", function () {
            axios.get("crud/logout.php")
                .then(function () {
                    //retirer les boutons
                    let bR = document.querySelector(".header--buttons--right")
                    removeAllChild(bR)
                    //ajouter les boutons
                    create("button", bR, "S'inscrire", "header--button--signUp").addEventListener("click", inscription)
                    create("button", bR, "Se connecter", "header--button--login").addEventListener("click", connection)
                    //fin de session
                    idSession = null
                    //retirer l'event listener des boutons
                    removeEvent()
                    //test si on est connecté
                    testCo()
                    //retour à l'accueil
                    if (getUrl() != "accueil") {
                        window.history.replaceState(stateObj,
                            "accueil", "?page=accueil");
                        loadPage(getUrl())
                    }
                })
        })
    }
}

function removeEvent() {
    document.querySelector(".header--button--login").removeEventListener("click", connection)
    document.querySelector(".header--button--signUp").removeEventListener("click", inscription)
    document.querySelector("#suggestion").removeEventListener("click", suggestion)
    document.querySelector("#formplaylist").removeEventListener("click", createplaylist)
    document.querySelector("#recent").removeEventListener("click", recent)
    document.querySelector("#likeplaylist").removeEventListener("click", like)
    document.querySelector("#recommandations").removeEventListener("click", recommandations)
}

testCo()
/*------------------------AFFICHE MUSIQUES------------------------------*/

function afficheMusiques(musiques) {
    let musiquesContainer = document.querySelector("#musiquesContainer")
    let numDate = 0;
    for (musique of musiques) {
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
        if (getUrl() == "recent") {
            axios.get("crud/getDate.php").then(function (response) {
                let resp = response.data[numDate]
                let textDate = create("div", texteMusique, resp, "textDate")
                numDate++
            })
        }
        //Bouton d'ajout d'une musique vers une playlist
        if (idSession != null) {
            let button = create("button", musiqueContainer, "+", null, musique.id)
            button.addEventListener("click", function () {
                addMusicToPlaylist(button.id)
            })
        }

        //Bouton de suppression d'une musique si admin
        if (testAdmin && getUrl() == "admin") {
            let buttonDelete = create("button", musiqueContainer, "-", "buttonDelete", musique.id)
            buttonDelete.addEventListener("click", function () {
                deleteMusic(buttonDelete.id)
            })
        }

        imageMusique.addEventListener("click", () => {
            jsonPlay = jsonMusiques
            idMusic = musiqueContainer.getAttribute('id')
            /*Récuperer la date courante */
            var now = new Date();
            var annee = now.getFullYear();
            var mois = now.getMonth() + 1;
            var jour = now.getDate();
            var heure = now.getHours();
            var minute = now.getMinutes();
            var seconde = now.getSeconds();

            axios.get("crud/addHistoric.php?idMusic=" + idMusic + "&date=Ecouté le " + jour + "/" + mois + "/" + annee + " à " + heure + " : " + minute + " : " + seconde + " secondes ")
            getAudiofromData(idMusic - 1)
            count = startMusicNextPrevious(count)
        })

    }
}

/*------------------------DELETE MUSIQUE------------------------------*/

function deleteMusic(id) {
    axios.get("crud/deletemusic.php?id=" + id)
        .then(function () {
            //reinitialisation jsonMusiques
            axios.get("crud/getallmusics.php?search=null")
                .then(function (response) {
                    jsonMusiques = []
                    jsonMusiques.push(response.data)
                    jsonAllMusique = []
                    jsonAllMusique.push(response.data)
                    removeAllChild(musiquesContainer)
                    afficheMusiques(jsonAllMusiques[0])
                })
        })
}
/*------------------------AFFICHE PLAYLISTS SIDEBAR------------------------------*/

function loadPlaylistsSide() {
    if (idSession != null) {
        //containers
        let menuExtra = document.querySelector(".menu-extra")
        let playlistsSideContainer = create("div", menuExtra, null, ".playlists-user-sidebar")
        axios.get("crud/getPlaylistsUser.php?idUser=" + idSession).then(function (response) {
            var playlists = response.data
            for (playlist of playlists) {
                let playlistContainer = create("div", playlistsSideContainer, null, "menu--item", playlist.hashlink)
                playlistContainer.addEventListener("click", function () {
                    window.history.replaceState(stateObj,
                        "accueil", "?page=" + playlistContainer.id);
                    loadPage(getUrl())
                })
                let link = create("a", playlistContainer)
                link.href = "javascript:void(0)"
                let i = create("i", link)
                let img = create("img", i, null, "playlist-sidebar-img")
                img.src = "images/playlist/" + playlist.image
                create("span", link, playlist.nom, "menu--item--text")

            }
        })
    }
}



/*------------------------AFFICHE PLAYLIST------------------------------*/




function affichePlaylists(playlists) {
    let playlistsContainerWrap = document.querySelector(".playlistsContainerWrap")
    for (playlist of playlists) {
        //Container
        let playlistLink = create("div", playlistsContainerWrap, null, null, playlist.hashlink)

        playlistLink.addEventListener("click", function () {
            window.history.replaceState(stateObj, "playlist", "?page=" + playlistLink.id)
            loadPage(getUrl())

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

//affiche users
function afficheUsers(users) {
    //Container
    create("p", usersContainer, "Utilisateurs", "labelUser");

    for (user of users) {
        if (user.id != 1000) {
            //Container
            let userContainer = create("div", usersContainer, null, "user", user.id);

            let imageUser = create("div", userContainer, null, "imageMusique");
            let image = create("img", imageUser);
            image.src = "images/user/" + user.images;

            //Texte
            let texteUser = create("div", userContainer, null, "texteUser");

            //id,login,mail
            create("p", texteUser, "Login : " + user.login, "loginUser");
            create("span", texteUser, "Email : " + user.email, "emailUser");
            create("p", texteUser, "ID : " + user.id, "idUser");

            //Bouton de suppression d'une musique si admin
            if (testAdmin) {
                let buttonDeleteUser = create("button", userContainer, "-", "buttonDelete", user.id)
                buttonDeleteUser.addEventListener("click", function () {
                    deleteUser(buttonDeleteUser.id)
                })
            }
        }
    }
}

/*------------------------AFFICHE TITRE LIKE------------------------------*/

function afficheTitreliké() {
    axios.get("crud/getMusicLiked.php").then(function (response) {
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

        if (idmusiques !== "NULL" && idmusiques !== "" && idmusiques !== undefined) {
            axios.get("crud/getmusiquesplaylist.php?id=" + idmusiques + "&search=null").then(function (response) {
                jsonMusiques = []
                jsonMusiques.push(response.data)
                let musiques = response.data;
                afficheMusiques(musiques);
            })
        }
        else {
            create("p", musiquesContainer, "Cette playlist ne contient pas de musiques !");
        }


    })
}


/*------------------------DELETE USERS------------------------------*/

function deleteUser(id) {
    axios.get("crud/deleteUser.php?id=" + id)
        .then(function () {
            //reinitialisation jsonUsers
            axios.get("crud/getallusers.php")
                .then(function (response) {
                    jsonUsers = []
                    jsonUsers.push(response.data)
                    removeAllChild(usersContainer)
                    afficheUsers(jsonUsers[0])
                })
        })
}

/*------------------------AFFICHE SUGGESTIONS------------------------------*/


//affiche suggestions
function afficheSuggestions(suggestions) {
    //Container
    create("p", suggestionsContainer, "Suggestions", "labelSuggestion");

    for (suggestion of suggestions) {
        //Container
        let suggestionContainer = create("div", suggestionsContainer, null, "suggestion", suggestion.id);

        //Texte
        let texteSuggestion = create("div", suggestionContainer, null, "texteSuggestion");

        //musique, artiste, utilisateur
        create("p", texteSuggestion, "Musique : " + suggestion.musique, "musiqueSuggestion");
        create("p", texteSuggestion, "Artiste : " + suggestion.artiste, "artisteSuggestion");
        if (suggestion.commentaire != null) {
            create("p", texteSuggestion, "Commentaire : " + suggestion.commentaire, "commentaireSuggestion");
        }
        create("p", texteSuggestion, "Proposée par : " + suggestion.utilisateur, "utilisateurSuggestion");

        //Bouton d'ajout
        let buttonAddSuggestion = create("button", suggestionContainer, "+", "buttonAdd", suggestion.id)
        buttonAddSuggestion.addEventListener("click", function () {
            addSuggestion(buttonAddSuggestion.id)
        })

        //Bouton de suppression
        let buttonDeleteSuggestion = create("button", suggestionContainer, "-", "buttonDelete", suggestion.id)
        buttonDeleteSuggestion.addEventListener("click", function () {
            deleteSuggestion(buttonDeleteSuggestion.id)
        })

    }
}

/*------------------------DELETE SUGGESTIONS------------------------------*/

function deleteSuggestion(id) {
    axios.get("crud/deleteSuggestion.php?id=" + id)
        .then(function () {
            //reinitialisation jsonSuggestions
            axios.get("crud/getsuggestion.php")
                .then(function (response) {
                    jsonSuggestions = []
                    jsonSuggestions.push(response.data)
                    removeAllChild(suggestionsContainer)
                    afficheSuggestions(jsonSuggestions[0])
                })
        })
}

/*------------------------ECOUTE RECEMMENT------------------------------*/
function listenrecently() {
    axios.get("crud/getHistoric.php").then(function (response) {
        let resp = response.data
        let idmusiques = resp.split('').reverse().join(''); // reverse la chaine du caractère pour avoir les plus récents en premier de la liste.

        if (idmusiques !== "NULL" && idmusiques !== "" && idmusiques !== undefined) {
            axios.get("crud/getmusiquesplaylist.php?id=" + idmusiques + "&search=null").then(function (response) {
                jsonMusiques = []
                jsonMusiques.push(response.data)
                let musiques = response.data;
                afficheMusiques(musiques);
            })
        }
        else {
            let containeur = document.querySelector("#musiquesContainer")
            create("p", containeur, "Vous n'avez encore écouté aucune musique ! Depechez vous de rejoindre notre catalogue !");
        }

    })
}


/*------------------- DATE -------------------------*/
function date() {
    /*Récuperer la date courante */
    let now = new Date();
    let annee = now.getFullYear();
    let mois = now.getMonth() + 1;
    let jour = now.getDate();
    let heure = now.getHours();
    let minute = now.getMinutes();
    let seconde = now.getSeconds();

}

/*------------------------FONCTION RECENT------------------------------*/
function recent() {
    if (getUrl() != "recent") {
        window.history.replaceState(stateObj,
            "accueil", "?page=recent");
        loadPage(getUrl())
    }
}

/*------------------------FONCTION LIKE------------------------------*/
function like() {
    if (getUrl() != "like") {
        window.history.replaceState(stateObj,
            "accueil", "?page=like");
        loadPage(getUrl())
    }
}

/*------------------------FONCTION RECOMMANDATIONS------------------------------*/
function recommandations() {
    if (getUrl() != "recommandations") {
        window.history.replaceState(stateObj,
            "accueil", "?page=recommandations");
        loadPage(getUrl())
    }
}