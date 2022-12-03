//creattion formulaire
function createFormulairePopup(){
    
    let formBlur = create("div",main,null,"form-blur")
    let formulaireContainer = create("div",formBlur,null,"formulaire-container")

    //croix
    let crossContain = create("div",formulaireContainer,null,"cross-form-contain")
    let crossForm = create("p",crossContain,"✖","cross")
    crossForm.addEventListener("click",closeForm)
    //Conteneur
    create("div",formulaireContainer,null,"formulaire")

    //Popup
    let popupContainer = create("div",main,null,"popup-container")
    popupContainer.classList.add("hidden")
    let popup = create("div",popupContainer,null,"popup")

    //Croix
    let crossPopup = create("p",popup,"✖","cross")
    crossPopup.addEventListener("click",closePopup)

    //Message
    create("p",popup,null,"popup-message")
}

//Fermer Popup
function closePopup(){
    let popupContainer = document.querySelector(".popup-container")
    popupContainer.classList.toggle("visible")
    popupContainer.classList.toggle("hidden")
}

//ouvrir Popup
function openPopup(message){
    document.querySelector(".popup-message").innerHTML = message;
    let popupContainer = document.querySelector(".popup-container")
    if(popupContainer.classList[1]=='hidden'){
        popupContainer.classList.toggle("hidden")
        popupContainer.classList.toggle("visible")
    }
}

//ouvrir formulaire
function openForm(){
    document.querySelector(".form-blur").style.display = "flex";
}

//fermer formulaire
function closeForm(){
    removeAllChild(document.querySelector(".formulaire"))
    document.querySelector(".form-blur").style.display="none"
}


//Ajouter musique vers playlist

function addMusicToPlaylist(idMusic){
    //recup formulaire via id musique
    axios.get("pages/formAddToPlay.php?idmusic="+idMusic)
    .then(function (response) {
        //affichage page formulaire
        
        document.querySelector(".formulaire").innerHTML = response.data;
        //ouverture formulaire
        openForm()

        //affichage datas musique
        axios.get("crud/getmusiquesplaylist.php?id="+idMusic+"&search=null")
        .then(function (response) {
            //change l'image de la musique du form
            let imageMusique = document.querySelector(".formulaire img")
            imageMusique.src = "images/musique/"+response.data[0].image

            //change le titre de la musique du formulaire
            let nomMusique = document.querySelector(".formulaire span")
            nomMusique.innerHTML = response.data[0].nom_music
        })

        //select parent options
        let select = document.querySelector("select")

        //recup playlists
        axios.get("crud/getallplaylists.php?search=null")
        .then(function (response) {
            for(playlist of response.data){
                //options du formulaire
                let option = create("option",select,playlist.nom)
                option.value = playlist.id
            }
        })

        //Boutton de confirmation
        let buttonForm = document.querySelector(".formulaire button")
        buttonForm.addEventListener("click",function(){

            //ajout
            if (select.value!="null") {
                
                axios.get("crud/addmusicpl.php?idpl=" + select.value + "&idmusic=" + idMusic
                ).then(function (response) {
                    if(response.statusText!="OK"){
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

//Connection 

function connection(){
    //recup formulaire via id musique
    axios.get("pages/login.php")
    .then(function (response) {
        //affichage page formulaire
        document.querySelector(".formulaire").innerHTML = response.data;
        //ouverture formulaire
        openForm()

        
        //S'inscrire
        let sinscrire = document.querySelector(".formulaire a")
        sinscrire.addEventListener("click",function(){
            closeForm()
            inscription()
        })

        //Boutton de confirmation
        let buttonForm = document.querySelector(".formulaire button")
        buttonForm.addEventListener("click",function(){
            //Recupération données input
            var login = document.querySelector("#login").value
            var pwd = document.querySelector("#pwd").value

            //Verification des données
            axios.get("config/checklogin.php?login="+login+"&pwd="+pwd)
            .then(function (response) {
                console.log(response.data)
                let invalidForm = document.querySelector("#invalidform")
                //nom deja pris
                if(response.data=="noaccount"){
                    invalidForm.innerHTML = "Ce compte n'existe pas"
                //formulaire mal remplis
                } else if(response.data=="wrongpwd"){
                    invalidForm.innerHTML = "Mauvais mot de passe"
                //ok, creation du compte

                } else {
                    var idCompte = response.data
                    
                    //connection
                    axios.get("config/startsession.php?id="+idCompte)
                    //actualise la page
                    location.reload()
                }
            })
        })

    })
}

//Inscription

function inscription(){
    //recup formulaire inscription
    axios.get("pages/register.php")
    .then(function (response) {

        //affichage page formulaire
        document.querySelector(".formulaire").innerHTML = response.data;

        //ouverture formulaire
        openForm()

        //Se connecter
        let seConnecter = document.querySelector(".formulaire a")
        seConnecter.addEventListener("click",function(){
            closeForm()
            connection()
        })
        
        //Boutton de confirmation
        let buttonForm = document.querySelector(".formulaire button")
        buttonForm.addEventListener("click",function(){
            //Recupération données input
            var login = document.querySelector("#login").value
            var pwd = document.querySelector("#pwd").value
            var pwdconfirm = document.querySelector("#pwdconfirm").value

            //Verification des données
            axios.get("config/checkinscription.php?login="+login+"&pwd="+pwd+"&pwdconfirm="+pwdconfirm)
            .then(function (response) {
                let invalidForm = document.querySelector("#invalidform")
                //nom deja pris
                if(response.data=="taken"){
                    invalidForm.innerHTML = "Ce nom est déjà pris !"
                //formulaire mal remplis
                } else if(response.data=="nok"){
                    invalidForm.innerHTML = "Remplissez correctement le formulaire !"
                //ok, creation du compte

                } else if(response.data=="ok"){
                    axios.get("crud/inscription.php?login="+login+"&pwd="+pwd)
                    .then(function (response) {
                        //id du compte
                        var idCompte = response.data

                        //connection
                        axios.get("config/startsession.php?id="+idCompte)
                        //actualise la page
                        location.reload()

                    })
                }
            })
        })
    })
}