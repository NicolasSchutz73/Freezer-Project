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

/*
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
*/


//Conteneurs
let main = document.querySelector("main")
var stateObj = { id: "100" };

//variables globales
let testAdmin = false;
let idSession = getIdSession()
let jsonMusiques = []
let jsonPlay = []
let page=""
let idsPlaylist =''

let jsonAllMusique = []
//initialisation jsonAllMusique
axios.get("crud/getallmusics.php?search=null")
    .then(function (response) {
        jsonAllMusique.push(response.data)
    })

//Function pour récupérer l'url courante et son paramètre
function getUrl(){
    var str = window.location.href
    var url = new URL(str)
    var pg = url.searchParams.get("page")
    //Si on est pas sur une page, redirige vers l'accueil
    if(pg==null){
        window.history.replaceState(stateObj,"accueil","?page=accueil");
        pg="accueil"
    }
    return pg;
}

//Renvoie l'id de la session, null si pas connecté, met a jour testadmin
function getIdSession(){
    var user=document.getElementsByClassName("header--button--user")
    if (user[0]==undefined){
        var idSession=null
    } else {
        var idSession=user[0].id
        if(idSession==1000){
            testAdmin=true;
        }
    }
    return idSession
}

/*
//récupère toutes les musiques pour l'admin 
let jsonAllMusique = []
//initialisation jsonAllMusique
axios.get("crud/getallmusics.php?search=null")
    .then(function (response) {
        jsonAllMusique.push(response.data)
    })

chercheMusic()
cherchePlaylist()
*/



/*------------------------LOAD PAGE------------------------------*/
//en fonction de l'url



function loadPage(url){

    //page accueil
    if(url=="accueil"){
        page=url
        console.log(page)

        //Reset
        jsonMusiques=[]
        removeAllChild(main)

        //Container playlist
        create("p", main, "Liste des playlists :", "label");
        let playlistsContainer = create("div",main,null,null,"playlistsContainer")
        create("div", playlistsContainer, null, "playlistsContainerWrap")

        //Container musique
        create("p", main, "Liste des musiques :", "label");
        create("div",main,null,null,"musiquesContainer")

        createFormulairePopup()
        
        //initialisation jsonMusiques
        axios.get("crud/getallmusics.php?search=null")
        .then(function (response) {
            jsonMusiques.push(response.data)
        })

        cherchePlaylist()
        chercheMusic()



    //page like
    } else if(url=="like") {
        page=url
        removeAllChild(main)
        createFormulairePopup()

        //Si pas connecté
        if(idSession==null){
            pageErreur()

        } else {

            //page like
            console.log("like")
            playlistsContainer = create("div",main,null,null,"playlistsContainer")
            create("p", main, "Liste des musiques :", "label");
            musiquesContainer = create("div",main,null,null,"musiquesContainer")
            afficheTitreliké()


        }


    //page playlist (12 car longueur du hashlink)
    } else if(url.length==12){
        page="playlist"
        console.log(page)

        axios.get("crud/getplaylist.php?pl=" + url)
            .then(function (response) {
                let playlistDatas = response.data[0];
                idsPlaylist = playlistDatas.musiques

                //Mise a jour jsonMusiques
                axios.get("crud/getmusiquesplaylist.php?id="+ idsPlaylist +"&search=null")
		        .then(function (response) {
                    jsonMusiques=[]
                    jsonMusiques.push(response.data)
                })

                //Reset
                removeAllChild(main)

                //Container playlist
                playlistsContainer = create("div",main,null,null,"playlistsContainer")

                //Container musiques
                create("p", main, "Liste des musiques :", "label");
                create("div",main,null,null,"musiquesContainer")
                createFormulairePopup()

                afficheInfosPlaylist(playlistDatas)
                chercheMusic()
            })



    //page admin
    } else if(url=="admin"){
        //reset
        page=url
        removeAllChild(main)
        createFormulairePopup()

        if(testAdmin){

            //AFFICHE PAGE ADMIN
            create("div",main,null,null,"usersContainer")
            create("div",main,null,null,"suggestionsContainer")
            create("div",main,null,null,"playlistsContainer")
            create("div",main,null,null,"musiquesContainer")

            //affiche les musiques
            afficheMusiques(jsonAllMusiques[0])
            //affiche les users
            afficheUsers(jsonUsers[0])

        } else {

            //PAGE ERREUR
            pageErreur()

        }

    //page non trouvée
    } else {
        page="error"
        console.log("???")

        removeAllChild(main)

        createFormulairePopup()
        pageErreur()
    }
}

//initialisation page
loadPage(getUrl())

//page erreur
function pageErreur(){
    let erreurContainer = create("div",main,null,"erreur-container")
    create("p",erreurContainer,"Oups ! La page que vous cherchez n'a pas été trouvée :/")
}




/*------------------------BOUTONS FORMULAIRE ET SIDE BAR------------------------------*/




//Boutton accueil
document.querySelector("#accueil").addEventListener("click",function(){
    window.history.replaceState(stateObj,
        "accueil", "?page=accueil");
    loadPage(getUrl())
    /*
    removeAllChild(usersContainer)
    removeAllChild(suggestionsContainer)
    */
})

//PAS CONNECTE
if(idSession==null){
    //login
    document.querySelector(".header--button--login").addEventListener("click",connection)

    //sign up
    document.querySelector(".header--button--signUp").addEventListener("click",inscription)

    //suggestion
    document.querySelector("#suggestion").addEventListener("click",function(){
        openPopup("Vous devez être connecté pour suggérer des musiques")
    })

    //Ecoutées récemment
    document.querySelector("#recent").addEventListener("click",function(){
        openPopup("Vous devez être connecté pour voir votre historique")
    })

    //Formulaire playlist
    document.querySelector("#formplaylist").addEventListener("click",function(){
        openPopup("Vous devez être connecté pour créer une playlist")
    })

    //Likes
    document.querySelector("#likeplaylist").addEventListener("click",function(){
        openPopup("Vous devez être connecté voir vos likés")
    })

//CONNECTE
} else {
    /*
    //login
    document.querySelector(".header--button--login").addEventListener("click",connection)
    */

    //suggestion
    document.querySelector("#suggestion").addEventListener("click",suggestion)
    
    //Ecoutées récemment
    document.querySelector("#recent").addEventListener("click",function(){
        openPopup("Historique")
    })
    
    //Formulaire playlist
    document.querySelector("#formplaylist").addEventListener("click",createplaylist)
    
    //Likes
    document.querySelector("#likeplaylist").addEventListener("click",function(){
        window.history.replaceState(stateObj,
            "like", "?page=like");
        loadPage(getUrl())
    })

}


/*------------------------AFFICHE MUSIQUES------------------------------*/

function afficheMusiques(musiques) {
    let musiquesContainer = document.querySelector("#musiquesContainer")
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
                    afficheMusiques(jsonAllMusique[0])
                })
        })
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


//récupère info utilisateur
let jsonUsers = []
//initialisation jsonUsers
axios.get("crud/getallusers.php")
    .then(function (response) {
        jsonUsers.push(response.data)
    })

//affiche users
function afficheUsers(users) {
    //Container
    create("p", usersContainer, "Utilisateurs", "labelUser");

    for (user of users) {
        if (user.id != 1000) {
            //Container
            let userContainer = create("div", usersContainer, null, "user", user.id);

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

function afficheTitreliké(){
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

//récupère info suggestion
let jsonSuggestions = []
//initialisation jsonSuggestions
axios.get("crud/getsuggestion.php")
    .then(function (response) {
        jsonSuggestions.push(response.data)
    })

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
