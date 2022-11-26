var buttonBackHistory = document.querySelector(".header--button.previous")
var buttonNextHistory = document.querySelector(".header--button.next")


buttonBackHistory.addEventListener("click",()=>
    history.go(-1)
)

buttonNextHistory.addEventListener("click",()=>
    history.go(1)
)
