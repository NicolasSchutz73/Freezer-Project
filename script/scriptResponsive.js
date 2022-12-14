const btnFullScreen = document.querySelector("#iconFullScreen");
const containerBtnAudio = document.querySelector("#conteneurButtonAudio");
const btnVolume = document.querySelector("#volume");
const displayTime = document.querySelector("#affichageTime");
const displayFinalTime = document.querySelector("#timeFinalAudio");
const hamburger= document.querySelector("#hamburger");

// evenement sur redimensionnement de la fenetre

//footer
if (window.addEventListener) {
    window.addEventListener('resize', function () {
        if (window.innerWidth < 530) {  // si inferieur a 530px
            containerBtnAudio.style.display = 'none'; //btn audio
            btnVolume.style.display = 'none'; //btn volume
            displayTime.style.display = 'none'; // affichage du temps bar audio
            displayFinalTime.style.display = 'none'; // affichage du temps bar audio
            btnFullScreen.style.right = '12%'  // plein ecran


            btnFullScreen.onclick = function () {  // toggle
                if (containerBtnAudio.style.display
                    && displayFinalTime.style.display
                    && displayTime.style.display === 'none'
                    && btnFullScreen.style.right === '12%') {

                    containerBtnAudio.style.display = 'block';
                    displayTime.style.display = 'block';
                    displayFinalTime.style.display = 'block';
                    btnFullScreen.style.right = '0%';
                }
                else {
                    containerBtnAudio.style.display = 'none';
                    displayTime.style.display = 'none';
                    displayFinalTime.style.display = 'none';
                    btnFullScreen.style.right = '12%';
                }
            }
        }
        else {
            containerBtnAudio.style.display = 'block';
            displayTime.style.display = 'block';
            displayFinalTime.style.display = 'block';
            btnFullScreen.style.right = '0%';
        }
    })
}


//sidebar
const sidebar = document.querySelector(".sidebar");

if (window.addEventListener) {
    window.addEventListener('resize', function () {
        if (window.innerWidth < 530) {
            sidebar.style.transform = "translateX(-100%)"

            hamburger.onclick = function () {
                if (sidebar.style.transform === "translateX(-100%)") {
                    sidebar.style.transform = "translateX(0)";
                }
                else {
                    sidebar.style.transform = "translateX(-100%)";
                }
            }
        }
        else {
            sidebar.style.transform = "translate(0)";

        }
    })
}