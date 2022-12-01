let main = document.querySelector("main")
let formBlur = create("div",main,null,"formBlur")
let formulaireContainer = create("div",formBlur,null,"formulaireContainer")

//croix
let crossContain = create("div",formulaireContainer,null,"crossContain")
create("p",crossContain,"✖","cross")
//Conteneur
let formulaire = create("div",formulaireContainer,null,"formulaire")

//Titre
create("h1",formulaire,'Titre Formulaire')
/*
//contenu
let elementsFormulaire = create("div",formulaire,null,"elementsFormulaire")
create("p",elementsFormulaire,"Nom d'utilisateur :");
let inputText = create("input",elementsFormulaire)
inputText.type = "text";
create('p',elementsFormulaire,"Mot de passe :")
let mdp = create("input",elementsFormulaire,null,null,"mdp")
mdp.type = "password";
*/

axios.get("crud/formAddToPlay.php?idmusic=1")
    .then(function (response) {
        formulaire.innerHTML = response.data;
    })

    /*
//boutton accept
create("button",formulaire,"Submit")
*/