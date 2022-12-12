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
let playlistOwner = false

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
    playlistOwner = false

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
            pageErreur()

        } else {

            //page like
            playlistsContainer = create("div", main, null, null, "playlistsContainer")
            create("p", main, "Liste des musiques :", "label");
            musiquesContainer = create("div", main, null, null, "musiquesContainer")
            afficheTitrelike()


        }


        //page playlist (12 car longueur du hashlink)
    } else if (url.length == 12) {
        page = "playlist"
        console.log(page)

        axios.get("crud/getplaylist.php?pl=" + url)
            .then(function (response) {
                let playlistDatas = response.data[0];
                axios.get("crud/getUserName.php")
                    .then(function (response) {

                        playlistOwner = (response.data[0]['login'] == playlistDatas['auteur'] || testAdmin)
                        idsPlaylist = playlistDatas.musiques


                        //Mise a jour jsonMusiques
                        axios.get("crud/getmusiquesplaylist.php?id=" + idsPlaylist + "&search=null")
                            .then(function (response) {
                                jsonMusiques = []
                                jsonMusiques.push(response.data)
                            })

                        //Reset
                        removeAllChild(main)
                        createFormulairePopup()

                        //Container playlist
                        playlistsContainer = create("div", main, null, null, "playlistsContainer")

                        //Container musiques
                        create("p", main, "Liste des musiques :", "label");
                        create("div", main, null, null, "musiquesContainer")
                        createFormulairePopup()

                        afficheInfosPlaylist(playlistDatas)

                        chercheMusic()
                    })
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
            create("p", main, "Liste des musiques :", "label");
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
                    if (jsonR.length == 0) {
                        console.log("Aucune recommandation pour le moment !")
                        create("p", document.querySelector("#musiquesContainer"), "Aucune recommandation pour le moment !")
                    } else { console.log(jsonR); afficheMusiques(jsonR) }
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
        console.log("pas connecté")
        //login
        document.querySelector(".header--button--login").addEventListener("click", connection)

        //sign up
        document.querySelector(".header--button--signUp").addEventListener("click", inscription)

        //suggestion
        document.querySelector("#suggestion").addEventListener("click", sugPopup)

        //Ecoutées récemment
        document.querySelector("#recent").addEventListener("click", recPopup)

        //Formulaire playlist
        document.querySelector("#formplaylist").addEventListener("click", plaPopup)

        //Likes
        document.querySelector("#likeplaylist").addEventListener("click", likePopup)

        //Recommandations
        document.querySelector("#recommandations").addEventListener("click", recPopup)

        //CONNECTE
    } else {
        if (testAdmin) {
            document.querySelector(".header--button--user").addEventListener("click", admin)
            //ajout musique
            document.querySelector("#suggestion").addEventListener("click", createMusique)
            document.querySelector("#suggestion span").innerHTML = "Ajouter musique"
        } else {
            document.querySelector(".header--button--user").addEventListener("click", function () {
                compte()
            })
            //suggestion
            document.querySelector("#suggestion").addEventListener("click", suggestion_fct)
        }

        //Ecoutées récemment
        document.querySelector("#recent").addEventListener("click", recent)

        //Formulaire playlist
        document.querySelector("#formplaylist").addEventListener("click", createplaylist)

        //Likes
        document.querySelector("#likeplaylist").addEventListener("click", like_fct)

        //Recommandations
        document.querySelector("#recommandations").addEventListener("click", recommandations)

        //Logout
        document.querySelector(".header--button--disconnect").addEventListener("click", logout)
    }
}

function removeEvent() {
    document.querySelector(".header--button--login").removeEventListener("click", connection)
    document.querySelector(".header--button--signUp").removeEventListener("click", inscription)
    document.querySelector("#suggestion").removeEventListener("click", suggestion_fct)
    document.querySelector("#formplaylist").removeEventListener("click", createplaylist)
    document.querySelector("#recent").removeEventListener("click", recent)
    document.querySelector("#likeplaylist").removeEventListener("click", like_fct)
    document.querySelector("#recommandations").removeEventListener("click", recommandations)
    document.querySelector("#suggestion").removeEventListener("click", createMusique)
    document.querySelector("#suggestion span").innerHTML = "Suggestion"
}

function removeEventPopup() {
    document.querySelector("#formplaylist").removeEventListener("click", plaPopup)
    document.querySelector("#recent").removeEventListener("click", recPopup)
    document.querySelector("#likeplaylist").removeEventListener("click", likePopup)
    document.querySelector("#recommandations").removeEventListener("click", recPopup)
    document.querySelector("#suggestion").removeEventListener("click", sugPopup)
}


testCo()
/*------------------------AFFICHE MUSIQUES------------------------------*/

function afficheMusiques(musiques) {
    let musiquesContainer = document.querySelector("#musiquesContainer")
    let numDate = 0;
    var indiceDelete = 1;
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
                tabDate = resp.split("/")

                sommeMusic = parseInt(tabDate[0]) + parseInt(tabDate[1]) * 60 + parseInt(tabDate[2]) * 3600 + parseInt(tabDate[3]) * 86400 + parseInt(tabDate[4]) * 2.6 * Math.pow(10, 6) + parseInt(tabDate[5]) * 3.15 * Math.pow(10, 7)
                var now = new Date();
                var annee = now.getFullYear();
                var mois = now.getMonth() + 1;
                var jour = now.getDate();
                var heure = now.getHours();
                var minute = now.getMinutes();
                var seconde = now.getSeconds();
                sommeDate = seconde + minute * 60 + heure * 3600 + jour * 86400 + mois * 2.6 * Math.pow(10, 6) + annee * 3.15 * Math.pow(10, 7)

                finalres = sommeDate - sommeMusic
                console.log(finalres)
                console.log(date(finalres))
                let textDate = create("div", texteMusique, date(finalres), "textDate")
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

        //Bouton de suppression d'une musique de playlists
        if (playlistOwner || (testAdmin && getUrl().length == 12)) {
            let buttonDelete = create("button", musiqueContainer, "-", "buttonDelete", indiceDelete)
            buttonDelete.addEventListener("click", function () {
                deleteMusicPlaylist(buttonDelete.id)
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

            axios.get("crud/addHistoric.php?idMusic=" + idMusic + "&date=" + seconde + "/" + minute + "/" + heure + "/" + jour + "/" + mois + "/" + annee)
            getAudiofromData(idMusic - 1)
            count = startMusicNextPrevious(count)
        })
        indiceDelete += 1;
    }
}

/*------------------------DELETE MUSIQUE------------------------------*/

function deleteMusic(id) {
    axios.get("crud/deletemusic.php?id=" + id)
        .then(function () {
            //reinitialisation jsonMusiques
            axios.get("crud/getallmusics.php?search=null")
                .then(function (response) {
                    jsonAllMusique = []
                    jsonAllMusique.push(response.data)
                    removeAllChild(musiquesContainer)
                    afficheMusiques(jsonAllMusique[0])
                })
        })
}

function deleteMusicPlaylist(id) {
    axios.get("crud/deleteMusicPlaylist.php?id=" + id + "&hashlink=" + getUrl())
        .then(function () {
            //reinitialisation jsonMusiques
            axios.get("crud/getmusiquesplaylist.php?id=" + idsPlaylist + "&search=null")
                .then(function (response) {
                    jsonMusiques = []
                    jsonMusiques.push(response.data)
                    loadPage(getUrl())
                    openPopup("La musique a été retirée de la playlist")
                })
        })
}

/*------------------------AFFICHE PLAYLISTS SIDEBAR------------------------------*/

function loadPlaylistsSide() {
    let playlistsSideContainer = document.querySelector(".playlists-user-sidebar")
    removeAllChild(playlistsSideContainer)
    if (idSession != null) {
        //containers
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
    if (playlistOwner) {
        let editPlaylist = create("p", texteInfoContainer, "Editer la playlist ", "edit-playlist")
        let i = create("i", editPlaylist, null, "fa-solid")
        i.classList.add("fa-pen")
        editPlaylist.addEventListener("click", function () {
            editPlaylistForm()
        })
    }
}


/*------------------------AFFICHE USERS------------------------------*/

//affiche users
function afficheUsers(users) {
    let infosAdmin = create("div", usersContainer, null, "infosAdmin");
    //Texte
    let texteAdmin = create("div", infosAdmin, null, "texteInfoAdmin");
    //Nom,auteur
    create("p", texteAdmin, "Administrateur", "nomAdmin");
    //Container
    create("p", usersContainer, "Liste des utilisateurs :", "label");

    for (user of users) {
        if (user.id != 1000) {
            //Container
            let userContainer = create("div", usersContainer, null, "user", user.id);

            //Image
            let imageUser = create("div", userContainer, null, "imageMusique");
            let image = create("img", imageUser);
            image.src = "images/user/" + user.image;

            //Texte
            let texteUser = create("div", userContainer, null, "texteUser");

            //id,login,mail
            create("p", texteUser, "Login : " + user.login, "loginUser");
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

function afficheTitrelike() {
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
    create("p", suggestionsContainer, "Liste des suggestions :", "label");

    for (suggestion of suggestions) {
        //Container
        let suggestionContainer = create("div", suggestionsContainer, null, "suggestion", suggestion.id);

        //Image
        let imageUser = create("div", suggestionContainer, null, "imageMusique");
        let image = create("img", imageUser);
        image.src = "images/user/" + suggestion.image_user;

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
            createMusique()
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
function date(seconde) {
    let phrase = "Ecouté il y a plus de "
    if (seconde > 3.15 * Math.pow(10, 7)) {
        phrase += NumberToLetter(Math.trunc(seconde / 3.15 * Math.pow(10, 7))) + " an"
    }
    else if (seconde > 2.6 * Math.pow(10, 6)) {
        phrase += NumberToLetter(Math.trunc(seconde / 2.6 * Math.pow(10, 6))) + " mois"
    }
    else if (seconde > 86400) {
        phrase = "Ecouté il y a "
        if ((Math.trunc(seconde / 86400)) == 1) {
            phrase += NumberToLetter(Math.trunc(seconde / 86400)) + " jour"
        }
        else { phrase += NumberToLetter(Math.trunc(seconde / 86400)) + " jours" }
    }
    else if (seconde > 3600) {
        if ((Math.trunc(seconde / 3600)) == 1) {
            phrase += NumberToLetter(Math.trunc(seconde / 3600)) + " heure"
        }
        else { phrase += NumberToLetter(Math.trunc(seconde / 3600)) + " heures" }
    }
    else if (seconde > 60) {
        phrase = "Ecouté il y a "
        if ((Math.trunc(seconde / 60)) == 1) {
            phrase += NumberToLetter(Math.trunc(seconde / 60), "f") + " minute"
        }
        else { phrase += NumberToLetter(Math.trunc(seconde / 60)) + " minutes" }
    }
    else {
        phrase = "Ecouté à l'instant"
    }
    return phrase
}

/*------------------- FUNCTION QUI TRANSFORMER CHIFFRE EN LETTRE -------------------------*/
function Unite(nombre, genre = null) {
    var unite;
    switch (nombre) {
        case 0: unite = "zéro"; break;
        case 1:
            if (genre == "f") { unite = "une" }
            else { unite = "un" }; break;
        case 2: unite = "deux"; break;
        case 3: unite = "trois"; break;
        case 4: unite = "quatre"; break;
        case 5: unite = "cinq"; break;
        case 6: unite = "six"; break;
        case 7: unite = "sept"; break;
        case 8: unite = "huit"; break;
        case 9: unite = "neuf"; break;
    }
    return unite;
}

function Dizaine(nombre) {
    switch (nombre) {
        case 10: dizaine = "dix"; break;
        case 11: dizaine = "onze"; break;
        case 12: dizaine = "douze"; break;
        case 13: dizaine = "treize"; break;
        case 14: dizaine = "quatorze"; break;
        case 15: dizaine = "quinze"; break;
        case 16: dizaine = "seize"; break;
        case 17: dizaine = "dix-sept"; break;
        case 18: dizaine = "dix-huit"; break;
        case 19: dizaine = "dix-neuf"; break;
        case 20: dizaine = "vingt"; break;
        case 30: dizaine = "trente"; break;
        case 40: dizaine = "quarante"; break;
        case 50: dizaine = "cinquante"; break;
        case 60: dizaine = "soixante"; break;
        case 70: dizaine = "soixante-dix"; break;
        case 80: dizaine = "quatre-vingt"; break;
        case 90: dizaine = "quatre-vingt-dix"; break;
    }//fin switch
    return dizaine;
}//-----------------------------------------------------------------------

function NumberToLetter(nombre, genre = null) {
    var i, j, n, quotient, reste, nb;
    var ch
    var numberToLetter = '';
    //__________________________________

    if (nombre.toString().replace(/ /gi, "").length > 15) return "dépassement de capacité";
    if (isNaN(nombre.toString().replace(/ /gi, ""))) return "Nombre non valide";

    nb = parseFloat(nombre.toString().replace(/ /gi, ""));
    if (Math.ceil(nb) != nb) return "Nombre avec virgule non géré.";

    n = nb.toString().length;
    switch (n) {
        case 1: numberToLetter = Unite(nb, genre); break;
        case 2: if (nb > 19) {
            quotient = Math.floor(nb / 10);
            reste = nb % 10;
            if (nb < 71 || (nb > 79 && nb < 91)) {
                if (reste == 0) numberToLetter = Dizaine(quotient * 10);
                if (reste == 1) numberToLetter = Dizaine(quotient * 10) + "-et-" + Unite(reste);
                if (reste > 1) numberToLetter = Dizaine(quotient * 10) + "-" + Unite(reste);
            } else numberToLetter = Dizaine((quotient - 1) * 10) + "-" + Dizaine(10 + reste);
        } else numberToLetter = Dizaine(nb);
            break;
        case 3: quotient = Math.floor(nb / 100);
            reste = nb % 100;
            if (quotient == 1 && reste == 0) numberToLetter = "cent";
            if (quotient == 1 && reste != 0) numberToLetter = "cent" + " " + NumberToLetter(reste);
            if (quotient > 1 && reste == 0) numberToLetter = Unite(quotient) + " cents";
            if (quotient > 1 && reste != 0) numberToLetter = Unite(quotient) + " cent " + NumberToLetter(reste);
            break;
        case 4: quotient = Math.floor(nb / 1000);
            reste = nb - quotient * 1000;
            if (quotient == 1 && reste == 0) numberToLetter = "mille";
            if (quotient == 1 && reste != 0) numberToLetter = "mille" + " " + NumberToLetter(reste);
            if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " mille";
            if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " mille " + NumberToLetter(reste);
            break;
        case 5: quotient = Math.floor(nb / 1000);
            reste = nb - quotient * 1000;
            if (quotient == 1 && reste == 0) numberToLetter = "mille";
            if (quotient == 1 && reste != 0) numberToLetter = "mille" + " " + NumberToLetter(reste);
            if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " mille";
            if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " mille " + NumberToLetter(reste);
            break;
        case 6: quotient = Math.floor(nb / 1000);
            reste = nb - quotient * 1000;
            if (quotient == 1 && reste == 0) numberToLetter = "mille";
            if (quotient == 1 && reste != 0) numberToLetter = "mille" + " " + NumberToLetter(reste);
            if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " mille";
            if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " mille " + NumberToLetter(reste);
            break;
        case 7: quotient = Math.floor(nb / 1000000);
            reste = nb % 1000000;
            if (quotient == 1 && reste == 0) numberToLetter = "un million";
            if (quotient == 1 && reste != 0) numberToLetter = "un million" + " " + NumberToLetter(reste);
            if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " millions";
            if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " millions " + NumberToLetter(reste);
            break;
        case 8: quotient = Math.floor(nb / 1000000);
            reste = nb % 1000000;
            if (quotient == 1 && reste == 0) numberToLetter = "un million";
            if (quotient == 1 && reste != 0) numberToLetter = "un million" + " " + NumberToLetter(reste);
            if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " millions";
            if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " millions " + NumberToLetter(reste);
            break;
        case 9: quotient = Math.floor(nb / 1000000);
            reste = nb % 1000000;
            if (quotient == 1 && reste == 0) numberToLetter = "un million";
            if (quotient == 1 && reste != 0) numberToLetter = "un million" + " " + NumberToLetter(reste);
            if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " millions";
            if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " millions " + NumberToLetter(reste);
            break;
        case 10: quotient = Math.floor(nb / 1000000000);
            reste = nb - quotient * 1000000000;
            if (quotient == 1 && reste == 0) numberToLetter = "un milliard";
            if (quotient == 1 && reste != 0) numberToLetter = "un milliard" + " " + NumberToLetter(reste);
            if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " milliards";
            if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " milliards " + NumberToLetter(reste);
            break;
        case 11: quotient = Math.floor(nb / 1000000000);
            reste = nb - quotient * 1000000000;
            if (quotient == 1 && reste == 0) numberToLetter = "un milliard";
            if (quotient == 1 && reste != 0) numberToLetter = "un milliard" + " " + NumberToLetter(reste);
            if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " milliards";
            if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " milliards " + NumberToLetter(reste);
            break;
        case 12: quotient = Math.floor(nb / 1000000000);
            reste = nb - quotient * 1000000000;
            if (quotient == 1 && reste == 0) numberToLetter = "un milliard";
            if (quotient == 1 && reste != 0) numberToLetter = "un milliard" + " " + NumberToLetter(reste);
            if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " milliards";
            if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " milliards " + NumberToLetter(reste);
            break;
        case 13: quotient = Math.floor(nb / 1000000000000);
            reste = nb - quotient * 1000000000000;
            if (quotient == 1 && reste == 0) numberToLetter = "un billion";
            if (quotient == 1 && reste != 0) numberToLetter = "un billion" + " " + NumberToLetter(reste);
            if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " billions";
            if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " billions " + NumberToLetter(reste);
            break;
        case 14: quotient = Math.floor(nb / 1000000000000);
            reste = nb - quotient * 1000000000000;
            if (quotient == 1 && reste == 0) numberToLetter = "un billion";
            if (quotient == 1 && reste != 0) numberToLetter = "un billion" + " " + NumberToLetter(reste);
            if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " billions";
            if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " billions " + NumberToLetter(reste);
            break;
        case 15: quotient = Math.floor(nb / 1000000000000);
            reste = nb - quotient * 1000000000000;
            if (quotient == 1 && reste == 0) numberToLetter = "un billion";
            if (quotient == 1 && reste != 0) numberToLetter = "un billion" + " " + NumberToLetter(reste);
            if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " billions";
            if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " billions " + NumberToLetter(reste);
            break;
    }//fin switch
    /*respect de l'accord de quatre-vingt*/
    if (numberToLetter.substr(numberToLetter.length - "quatre-vingt".length, "quatre-vingt".length) == "quatre-vingt") numberToLetter = numberToLetter + "s";

    return numberToLetter;
}//-----------------------------------------------------------------------


/*------------------------FONCTION RECENT------------------------------*/
function recent() {
    if (getUrl() != "recent") {
        window.history.replaceState(stateObj,
            "accueil", "?page=recent");
        loadPage(getUrl())
    }
}

/*------------------------FONCTION LIKE------------------------------*/
function like_fct() {
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

/*------------------------FONCTION ADMIN------------------------------*/
function admin() {
    if (getUrl() != "admin") {
        window.history.replaceState(stateObj,
            "accueil", "?page=admin");
        loadPage(getUrl())
    }
}

/*------------------------FONCTION LOGOUT------------------------------*/
function logout() {
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
            //test admin
            testAdmin = false
            //retirer l'event listener des boutons
            removeEvent()
            //retire les playlists du side bar
            removeAllChild(document.querySelector(".playlists-user-sidebar"))
            //retire le bouton like
            document.querySelector("#likeMusic").classList.add("disable")
            //test si on est connecté
            testCo()
            //retour à l'accueil
            if (getUrl() != "accueil") {
                window.history.replaceState(stateObj,
                    "accueil", "?page=accueil");
                loadPage(getUrl())
            }
        })
}

/*------------------------FONCTION POPUP------------------------------*/
function sugPopup() {
    openPopup("Vous devez être connecté pour suggérer des musiques")
}

function recPopup() {
    openPopup("Vous devez être connecté pour voir votre historique")
}

function plaPopup() {
    openPopup("Vous devez être connecté pour créer une playlist")
}

function likePopup() {
    openPopup("Vous devez être connecté pour voir vos like")
}

function recPopup() {
    openPopup("Vous devez être connecté pour voir vos recommandations")
}
