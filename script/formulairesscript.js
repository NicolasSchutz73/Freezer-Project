//creattion formulaire
function createFormulairePopup() {

    let formBlur = create("div", main, null, "form-blur")
    let formulaireContainer = create("div", formBlur, null, "formulaire-container")

    //croix
    let crossContain = create("div", formulaireContainer, null, "cross-form-contain")
    let crossForm = create("p", crossContain, "✖", "cross")
    crossForm.addEventListener("click", closeForm)
    //Conteneur
    create("div", formulaireContainer, null, "formulaire")

    //Popup
    let popupContainer = create("div", main, null, "popup-container")
    popupContainer.classList.add("hidden")
    let popup = create("div", popupContainer, null, "popup")

    //Croix
    let crossPopup = create("p", popup, "✖", "cross")
    crossPopup.addEventListener("click", closePopup)

    //Message
    create("p", popup, null, "popup-message")
}

//Fermer Popup
function closePopup() {
    let popupContainer = document.querySelector(".popup-container")
    popupContainer.classList.toggle("visible")
    popupContainer.classList.toggle("hidden")
}

//ouvrir Popup
function openPopup(message) {
    document.querySelector(".popup-message").innerHTML = message;
    let popupContainer = document.querySelector(".popup-container")
    if (popupContainer.classList[1] == 'hidden') {
        popupContainer.classList.toggle("hidden")
        popupContainer.classList.toggle("visible")
    }
}

//ouvrir formulaire
function openForm() {
    document.querySelector(".form-blur").style.display = "flex";
}

//fermer formulaire
function closeForm() {
    removeAllChild(document.querySelector(".formulaire"))
    document.querySelector(".form-blur").style.display = "none"
}


//Ajouter musique vers playlist

function addMusicToPlaylist(idMusic) {
    //recup formulaire via id musique
    axios.get("pages/formAddToPlay.php?idmusic=" + idMusic)
        .then(function (response) {
            //affichage page formulaire

            document.querySelector(".formulaire").innerHTML = response.data;
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
            axios.get("crud/getPlaylistsUser.php?idUser=" + idSession)
                .then(function (response) {
                    var playlists = response.data
                    for (playlist of playlists) {
                        //options formulaire
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
                    let invalidForm = document.querySelector("#invalidform")
                    invalidForm.innerHTML = "Vous devez choisir une playlist !"
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

//Connection 

function connection() {
    //recup formulaire via id musique
    axios.get("pages/login.php")
        .then(function (response) {
            //affichage page formulaire
            document.querySelector(".formulaire").innerHTML = response.data;
            //ouverture formulaire
            openForm()


            //S'inscrire
            let sinscrire = document.querySelector(".formulaire a")
            sinscrire.addEventListener("click", function () {
                closeForm()
                inscription()
            })

            //Boutton de confirmation
            let buttonForm = document.querySelector(".formulaire button")
            buttonForm.addEventListener("click", function () {
                //Recupération données input
                var login = document.querySelector("#login").value
                var pwd = document.querySelector("#pwd").value

                //Verification des données
                axios.get("config/checklogin.php?login=" + login + "&pwd=" + pwd)
                    .then(function (response) {
                        console.log(response.data)
                        let invalidForm = document.querySelector("#invalidform")
                        //nom deja pris
                        if (response.data == "noaccount") {
                            invalidForm.innerHTML = "Ce compte n'existe pas"
                            //formulaire mal remplis
                        } else if (response.data == "wrongpwd") {
                            invalidForm.innerHTML = "Mauvais mot de passe"
                            //ok, creation du compte

                        } else {
                            var idCompte = response.data
                            idSession = idCompte

                            //connection
                            axios.get("config/startsession.php?id=" + idCompte)
                            closeForm()
                            //retirer les boutons
                            let bR = document.querySelector(".header--buttons--right")
                            removeAllChild(bR)
                            //ajouter les boutons deconnection et user
                            let button = create("button", bR, null, "header--button--user", idSession)
                            let ico = create("i", button)
                            ico.classList.add("fa-solid", "fa-user")
                            button.appendChild(document.createTextNode(" " + login + " "))
                            let button2 = create("button", bR, null, "header--button--disconnect")
                            let ico2 = create("i", button2)
                            ico2.classList.add("fa-solid", "fa-right-from-bracket")
                            button2.addEventListener("click", logout)
                            //testAdmin
                            if (idSession == 1000) { testAdmin = true } else { testAdmin = false }
                            //removeEventPopup
                            removeEventPopup()
                            //ajout like footer
                            document.querySelector("#likeMusic").classList.remove("disable")
                            //initialisation page
                            loadPlaylistsSide()
                            //testCO
                            testCo()
                        }
                    })
            })

        })
}

//Inscription

function inscription() {
    //recup formulaire inscription
    axios.get("pages/register.php")
        .then(function (response) {

            //affichage page formulaire
            document.querySelector(".formulaire").innerHTML = response.data;

            //ouverture formulaire
            openForm()

            //Se connecter
            let seConnecter = document.querySelector(".formulaire a")
            seConnecter.addEventListener("click", function () {
                closeForm()
                connection()
            })

            //Boutton de confirmation
            let buttonForm = document.querySelector(".formulaire button")
            buttonForm.addEventListener("click", function () {
                //Recupération données input
                var login = document.querySelector("#login").value
                var pwd = document.querySelector("#pwd").value
                var pwdconfirm = document.querySelector("#pwdconfirm").value

                //Verification des données
                axios.get("config/checkinscription.php?login=" + login + "&pwd=" + pwd + "&pwdconfirm=" + pwdconfirm)
                    .then(function (response) {
                        let invalidForm = document.querySelector("#invalidform")
                        //nom deja pris
                        if (response.data == "taken") {
                            invalidForm.innerHTML = "Ce nom est déjà pris !"
                            //formulaire mal remplis
                        } else if (response.data == "nok") {
                            invalidForm.innerHTML = "Remplissez correctement le formulaire"
                            //ok, creation du compte

                        } else if (response.data == "ok") {
                            axios.get("crud/inscription.php?login=" + login + "&pwd=" + pwd)
                                .then(function (response) {
                                    //id du compte
                                    var idCompte = response.data
                                    idSession = idCompte

                                    //connection
                                    axios.get("config/startsession.php?id=" + idCompte)
                                    closeForm()
                                    //retirer les boutons
                                    let bR = document.querySelector(".header--buttons--right")
                                    removeAllChild(bR)
                                    //ajouter les boutons deconnection et user
                                    let button = create("button", bR, null, "header--button--user", idSession)
                                    let ico = create("i", button)
                                    ico.classList.add("fa-solid", "fa-user")
                                    button.appendChild(document.createTextNode(" " + login + " "))
                                    let button2 = create("button", bR, null, "header--button--disconnect")
                                    let ico2 = create("i", button2)
                                    ico2.classList.add("fa-solid", "fa-right-from-bracket")
                                    button2.addEventListener("click", logout)
                                    //testAdmin
                                    if (idSession == 1000) { testAdmin = true } else { testAdmin = false }
                                    //removeEventPopup
                                    removeEventPopup()
                                    //ajout like footer
                                    document.querySelector("#likeMusic").classList.remove("disable")
                                    //initialisation page
                                    loadPlaylistsSide()
                                    //testCO
                                    testCo()
                                })
                        }
                    })
            })
        })
}


//Suggestion
function suggestion_fct() {

    //recup formulaire via id musique
    axios.get("pages/suggestion.php")
        .then(function (response) {
            //affichage page formulaire
            document.querySelector(".formulaire").innerHTML = response.data;
            //ouverture formulaire
            openForm()

            //Boutton de confirmation
            let buttonForm = document.querySelector(".formulaire button")
            buttonForm.addEventListener("click", function () {
                //Recupération données input
                var musique = document.querySelector("#musicname").value
                var artiste = document.querySelector("#artist").value
                var comment = document.querySelector("#comment").value

                //Verification des données
                axios.get("crud/createSuggestion.php?iduser=" + idSession + "&musique=" + musique + "&artiste=" + artiste + "&commentaire=" + comment)
                    .then(function (response) {
                        console.log(response.data)
                        let invalidForm = document.querySelector("#invalidform")
                        if (response.data == "OK") {
                            openPopup("Votre suggestion a été soumise aux administrateurs !")
                            closeForm()
                        } else {
                            invalidForm.innerHTML = "Remplissez correctement le formulaire"
                        }
                    })

            })

        })
}

//creation playlist
function createplaylist() {
    //recup formulaire via id musique
    axios.get("pages/nouvellePlaylist.php")
        .then(function (response) {
            //affichage page formulaire
            document.querySelector(".formulaire").innerHTML = response.data;
            //ouverture formulaire
            openForm()

            //variables formulaire
            var maxFileSize = 8000000 //8MB
            var maxPlaylistNameSize = 30
            var acceptedFiles = ['image/png', 'image/jpeg']

            //caractère invalides pour le nom de playlists
            const specialChars = /[<>]/;

            //selecteurs
            var nomPlaylist = document.querySelector("#nomPlaylist")
            var imagePlaylist = document.querySelector("#imagePlaylist")
            var invalidForm = document.querySelector("#invalidform")
            var fileName = document.querySelector("#file-name")

            var formData = new FormData();

            //Bouton de confirmation
            let buttonForm = document.querySelector(".formulaire button")

            //affiche le nom du fichier
            imagePlaylist.addEventListener("change", function () {
                fileName.innerHTML = ""
                if (imagePlaylist.files[0] != undefined) {
                    fileName.innerHTML = imagePlaylist.files[0]['name']
                }

            })

            buttonForm.addEventListener("click", function () {
                invalidForm.innerHTML = ""
                //verification nom de la playlist
                if (nomPlaylist.value == "" || specialChars.test(nomPlaylist.value) || nomPlaylist.value.length > maxPlaylistNameSize) {
                    invalidForm.innerHTML = "Ce nom de playlist n'est pas valide"

                    //verification fichier
                } else if (imagePlaylist.files[0] == undefined) {
                    invalidForm.innerHTML = "Veuillez choisir un fichier"
                } else if (imagePlaylist.files[0]['name'] == '' || imagePlaylist.files[0]['size'] > maxFileSize || !acceptedFiles.includes(imagePlaylist.files[0]['type'])) {
                    invalidForm.innerHTML = "Ce fichier n'est pas valide"
                } else {
                    console.log("valid form")
                    formData.append("nom", nomPlaylist.value);
                    formData.append("image", imagePlaylist.files[0]);
                    formData.append("session", idSession);

                    axios.post("crud/createplaylist.php", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(function () {
                        loadPlaylistsSide()
                        closeForm()
                        //rechargement main si sur l'accueil
                        if (page == "accueil") {
                            loadPage(getUrl())
                        }
                        openPopup("La playlist a été créée avec succès !")

                    })
                }

            })
        })
}

//creation playlist
function createMusique() {
    console.log("formMusique")
    //recup formulaire via id musique
    axios.get("pages/nouvelleMusique.php")
        .then(function (response) {
            //affichage page formulaire
            document.querySelector(".formulaire").innerHTML = response.data;
            //ouverture formulaire
            openForm()

            //variables formulaire
            var maxImageFileSize = 8000000 //8MB
            var maxMusiqueFileSize = 8000000 //8MB
            var maxNameSize = 30
            var acceptedImageFiles = ['image/png', 'image/jpeg']
            var acceptedMusiqueFiles = ['audio/mpeg']

            //caractère invalides pour le nom de playlists
            const specialChars = /[<>]/;

            //selecteurs
            var nomMusique = document.querySelector("#nomMusique")
            var nomArtiste = document.querySelector("#nomArtiste")
            var genre = document.querySelector("#genre")
            var imageMusique = document.querySelector("#imageMusique")
            var musique = document.querySelector("#musique")
            var invalidForm = document.querySelector("#invalidform")
            var fileNameImage = document.querySelector("#file-name-image")
            var fileNameMusique = document.querySelector("#file-name-musique")

            var formData = new FormData();

            //Bouton de confirmation
            let buttonForm = document.querySelector(".formulaire button")

            //affiche les noms des fichier
            imageMusique.addEventListener("change", function () {
                fileNameImage.innerHTML = ""
                if (imageMusique.files[0] != undefined) {
                    fileNameImage.innerHTML = imageMusique.files[0]['name']
                }
            })

            musique.addEventListener("change", function () {
                fileNameMusique.innerHTML = ""
                if (musique.files[0] != undefined) {
                    fileNameMusique.innerHTML = musique.files[0]['name']
                }
            })

            buttonForm.addEventListener("click", function () {
                invalidForm.innerHTML = ""
                //verification nom de la musique/artiste
                if (nomMusique.value == "" || specialChars.test(nomMusique.value) || nomMusique.value.length > maxNameSize) {
                    invalidForm.innerHTML = "Ce nom de musique n'est pas valide"
                } else if (nomArtiste.value == "" || specialChars.test(nomArtiste.value) || nomArtiste.value.length > maxNameSize) {
                    invalidForm.innerHTML = "Ce nom d'auteur n'est pas valide"
                } else if (genre.vale == "" || specialChars.test(genre.value) || genre.value.length > maxNameSize) {
                    invalidForm.innerHTML = "Ce genre n'est pas valide"

                    //verification fichiers
                    //image
                } else if (imageMusique.files[0] == undefined) {
                    invalidForm.innerHTML = "Veuillez choisir une image"
                } else if (imageMusique.files[0]['name'] == '' || imageMusique.files[0]['size'] > maxImageFileSize || !acceptedImageFiles.includes(imageMusique.files[0]['type'])) {
                    invalidForm.innerHTML = "Cette image n'est pas valide"
                    //musique
                } else if (musique.files[0] == undefined) {
                    invalidForm.innerHTML = "Veuillez choisir une musique"
                } else if (musique.files[0]['name'] == '' || musique.files[0]['size'] > maxMusiqueFileSize || !acceptedMusiqueFiles.includes(musique.files[0]['type'])) {
                    invalidForm.innerHTML = "Cette musique n'est pas valide"
                } else {
                    console.log("valid form")

                    formData.append("nomMusique", nomMusique.value);
                    formData.append("nomArtiste", nomArtiste.value);
                    formData.append("genre", genre.value);
                    formData.append("imageMusique", imageMusique.files[0]);
                    formData.append("musique", musique.files[0]);

                    axios.post("crud/createmusique.php", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(function () {

                        closeForm()
                        //rechargement main si sur l'accueil
                        if (page == "accueil" || page == "admin") {
                            loadPage(getUrl())
                        }
                        openPopup("La musique a été ajoutée avec succès !")

                    })

                }

            })
        })

}

function compte() {

    //recup formulaire
    axios.get("pages/compte.php")
        .then(function (response) {
            //affichage page formulaire
            document.querySelector(".formulaire").innerHTML = response.data;

            //image
            let imgCompte = document.querySelector("#img-compte")
            axios.get("crud/getImageUser.php")
                .then(function (response) {

                    imgCompte.src = "images/user/" + response.data[0]["image"]
                    //ouverture formulaire
                    openForm()
                    //variables formulaire
                    var maxImageFileSize = 8000000 //8MB
                    var acceptedImageFiles = ['image/png', 'image/jpeg']

                    //caractère invalides pour le nom de playlists
                    const specialChars = /[<>]/;

                    //selecteurs
                    var pwd = document.querySelector("#pwd")
                    var pwdconfirm = document.querySelector("#pwdconfirm")
                    var image = document.querySelector("#image")
                    var invalidFormImage = document.querySelector("#invalidform-image")
                    var invalidFormPwd = document.querySelector("#invalidform-password")
                    var fileName = document.querySelector("#file-name")

                    var formData = new FormData();

                    //Bouton de confirmation
                    let buttonFormImage = document.querySelector("#imageconfirm")
                    let buttonFormPwd = document.querySelector("#newpwd")

                    //affiche nom fichier
                    image.addEventListener("change", function () {
                        fileName.innerHTML = ""
                        if (image.files[0] != undefined) {
                            fileName.innerHTML = image.files[0]['name']
                        }
                    })

                    buttonFormImage.addEventListener("click", function () {
                        if (image.files[0] == undefined) {
                            invalidFormImage.innerHTML = "Veuillez choisir une image"
                        } else if (image.files[0]['name'] == '' || image.files[0]['size'] > maxImageFileSize || !acceptedImageFiles.includes(image.files[0]['type'])) {
                            invalidFormImage.innerHTML = "Cette image n'est pas valide"
                        } else {
                            formData.append("image", image.files[0])

                            axios.post("crud/updateImageUser.php", formData, {
                                header: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }).then(function () {
                                closeForm()
                                openPopup("Votre photo de profil a été changée avec succès !")

                                //update header
                                var imageHeader = document.querySelector(".header--button--user img")
                                axios.get("crud/getImageUser.php")
                                    .then(function (response) {
                                        imageHeader.src = "images/user/" + response.data[0]["image"]
                                    })

                            })
                        }
                    })

                    buttonFormPwd.addEventListener("click", function () {
                        if (pwd.value == "" || specialChars.test(pwd.value) || pwd.value != pwdconfirm.value) {
                            invalidFormPwd.innerHTML = "Veuillez remplir correctement le formulaire"
                        } else {

                            formData.append("pwd", pwd.value)

                            axios.post("crud/updatepwd.php", formData, {
                                header: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }).then(function () {
                                closeForm()
                                openPopup("Votre mot de passe a bien été changé")

                            })

                        }
                    })


                })
        })
}

function editPlaylistForm() {

    //recup formulaire
    axios.get("pages/editPlaylist.php")
        .then(function (response) {
            //affichage page formulaire
            document.querySelector(".formulaire").innerHTML = response.data;
            //ouverture formulaire
            openForm()


            axios.get("crud/getplaylist.php?pl=" + getUrl())
                .then(function (response) {
                    var datas = response.data[0]
                    document.querySelector(".formulaire img").src = "images/playlist/" + datas['image'];

                    //variables formulaire
                    var maxFileSize = 8000000 //8MB
                    var maxNameSize = 30
                    var acceptedFiles = ['image/png', 'image/jpeg']

                    //caractère invalides pour le nom de playlists
                    const specialChars = /[<>]/;

                    //selecteurs
                    var nom = document.querySelector("#name")
                    var image = document.querySelector("#image")
                    var invalidFormImage = document.querySelector("#invalidform-image")
                    var invalidFormName = document.querySelector("#invalidform-name")
                    var fileName = document.querySelector("#file-name")

                    var formData = new FormData();

                    //Bouton de confirmation
                    let buttonFormImage = document.querySelector("#imageconfirm")
                    let buttonFormName = document.querySelector("#nameconfirm")
                    var deleteCross = document.querySelector("#delete-playlist-cross")

                    //affiche le nom du fichier
                    image.addEventListener("change", function () {
                        fileName.innerHTML = ""
                        if (image.files[0] != undefined) {
                            fileName.innerHTML = image.files[0]['name']
                        }
                    })

                    buttonFormImage.addEventListener("click", function () {
                        if (image.files[0] == undefined) {
                            invalidFormImage.innerHTML = "Veuillez choisir une image"
                        } else if (image.files[0]['name'] == '' || image.files[0]['size'] > maxFileSize || !acceptedFiles.includes(image.files[0]['type'])) {
                            invalidFormImage.innerHTML = "Cette image n'est pas valide"
                        } else {

                            formData.append("image", image.files[0])
                            formData.append("link", datas['hashlink'])

                            axios.post("crud/updateImagePlaylist.php", formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }).then(function () {

                                closeForm()
                                //rechargement
                                loadPlaylistsSide()
                                loadPage(getUrl())

                                openPopup("La playlist à été mise à jour")

                            })
                        }
                    })

                    buttonFormName.addEventListener("click", function () {
                        //verification nom de la playlist
                        if (nom.value == "" || specialChars.test(nom.value) || nom.value.length > maxNameSize) {
                            invalidFormName.innerHTML = "Ce nom de playlist n'est pas valide"
                        } else {
                            formData.append("nom", nom.value)
                            formData.append("link", datas['hashlink'])

                            axios.post("crud/updateNamePlaylist.php", formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }).then(function () {

                                closeForm()
                                //rechargement
                                loadPlaylistsSide()
                                loadPage(getUrl())

                                openPopup("La playlist à été mise à jour")

                            })
                        }
                    })

                    deleteCross.addEventListener("click", function () {

                        formData.append("link", datas['hashlink'])

                        axios.post("crud/deletePlaylist.php", formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then(function () {
                            closeForm()

                            //redirection
                            window.history.replaceState(stateObj,
                                "accueil", "?page=accueil");
                            loadPage(getUrl())

                            //rechargement
                            loadPlaylistsSide()

                            openPopup("La playlist à supprimée avec succès")
                        })
                    })

                })
        })
}