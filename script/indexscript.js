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

//Renvoie l'id de la session, null si pas connecté
function getIdSession(){
    var user=document.getElementsByClassName("header--button--user")
    if (user[0]==undefined){
        var idSession=null
    } else {
        var idSession=user[0].id
    }
    return idSession
}

//Conteneurs
let main = document.querySelector("main")
var stateObj = { id: "100" };

//variables globales
let idSession = getIdSession()
let jsonMusiques = []
let jsonPlay = []
let page=""
let idsPlaylist =''

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
        button.addEventListener("click", function(){
            addMusicToPlaylist(button.id)
        })

        imageMusique.addEventListener("click", () => {
            jsonPlay = jsonMusiques
            axios.get("config/save.php?tab="+jsonMusiques)
            idMusic = musiqueContainer.getAttribute('id')
            getAudiofromData(idMusic-1)
            count = startMusicNextPrevious(count)
        })

    }
}



/*------------------------AFFICHE PLAYLIST------------------------------*/




function affichePlaylists(playlists) {
    let playlistsContainerWrap = document.querySelector(".playlistsContainerWrap")
    for (playlist of playlists) {
        //Container
        let playlistLink = create("div", playlistsContainerWrap,null,null,playlist.hashlink)

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