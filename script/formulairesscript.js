let main = document.querySelector("main")
let formBlur = create("div", main, null, "form-blur")
let formulaireContainer = create("div", formBlur, null, "formulaire-container")

//croix
let crossContain = create("div", formulaireContainer, null, "cross-form-contain")
let crossForm = create("p", crossContain, "✖", "cross")
crossForm.addEventListener("click", closeForm)
//Conteneur
let formulaire = create("div", formulaireContainer, null, "formulaire")

//Titre
/*
create("h1",formulaire,'Titre Formulaire')

//contenu
let elementsFormulaire = create("div",formulaire,null,"elementsFormulaire")
create("p",elementsFormulaire,"Nom d'utilisateur :");
let inputText = create("input",elementsFormulaire)
inputText.type = "text";
create('p',elementsFormulaire,"Mot de passe :")
let mdp = create("input",elementsFormulaire,null,null,"mdp")
mdp.type = "password";
*/

//Popup
let popupContainer = create("div", main, null, "popup-container")
popupContainer.classList.add("hidden")
let popup = create("div", popupContainer, null, "popup")

//Croix
let crossPopup = create("p", popup, "✖", "cross")
crossPopup.addEventListener("click", closePopup)

//Message
let popupMessage = create("p", popup, "Texte popup bla bla bla")

//Fermer Popup
function closePopup() {
    popupContainer.classList.toggle("visible")
    popupContainer.classList.toggle("hidden")
}

//ouvrir Popup
function openPopup(message) {
    popupMessage.innerHTML = message;
    popupContainer.classList.toggle("hidden")
    popupContainer.classList.toggle("visible")
}

//ouvrir formulaire
function openForm() {
    formBlur.style.display = "flex";
}

//fermer formulaire
function closeForm() {
    removeAllChild(formulaire)
    formBlur.style.display = "none"
}


//Ajouter musique vers playliste
function addMusicToPlaylist(idMusic) {
    //recup formulaire via id musique
    axios.get("pages/formAddToPlay.php?idmusic=" + idMusic)
        .then(function (response) {
            //affichage page formulaire
            formulaire.innerHTML = response.data;
            //ouverture formulaire
            openForm()

            //affichage datas musique
            axios.get("crud/getmusiquesplaylist.php?id=" + idMusic + "&search=null")
                .then(function (response) {
                    //change l'image de la musique du form
                    let imageMusique = document.querySelector(".formulaire img")
                    imageMusique.src = "images/musique/" + response.data[0].image

                    //change le titre de la musique du formulaire
                    let nomMusique = document.querySelector(".formulaire span")
                    nomMusique.innerHTML = response.data[0].nom_music
                })

            //select parent options
            let select = document.querySelector("select")

            //recup playlists
            axios.get("crud/getallplaylists.php?search=null")
                .then(function (response) {
                    for (playlist of response.data) {
                        //options du formulaire
                        let option = create("option", select, playlist.nom)
                        option.value = playlist.id
                    }
                })

            //Boutton de confirmation
            let buttonForm = document.querySelector(".formulaire button")
            buttonForm.addEventListener("click", function () {

                //ajout
                if (select.value != "null") {

                    axios.get("crud/addmusicpl.php?idpl=" + select.value + "&idmusic=" + idMusic
                    ).then(function (response) {
                        if (response.statusText != "OK") {
                            openPopup("Une erreur est survenue")
                        } else {
                            openPopup("La musique a été ajoutée à la playlist !")
                        }
                    })
                    closeForm()

                } else {
                    let errorMessageContainer = document.querySelector(".formulaire div")
                    create("p", errorMessageContainer, "Vous devez choisir une playlist !")
                }

            })
        })
}

/* FORMULAIRE D'AJOUT DE MUSIQUE */

function addSuggestion(suggestionID) {
    //récupération du formulaire via id suggestion
    axios.get("pages/formAddMusic.php?idSuggestion=" + suggestionID)
        .then(function (response) {
            //affichage page formulaire
            formulaire.innerHTML = response.data;
            //ouverture formulaire
            openForm()
        })

    //Bouton de confirmation
    let buttonForm = document.querySelector(".formulaire button")
    buttonForm.addEventListener("click", function () {

        //ajout
        axios.get("crud/addMusicDB.php")
            .then(function (response) {
                if (response.statusText != "OK") {
                    openPopup("Une erreur est survenue")
                } else {
                    openPopup("La musique a été ajoutée à la base de donnée !")
                }
            })
        closeForm()

    })
}