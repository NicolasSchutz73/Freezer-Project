var buttonBackHistory = document.querySelector(".header--button.previous")
var buttonNextHistory = document.querySelector(".header--button.next")

let disconnect = document.querySelector("#disconnect")

disconnect.addEventListener("click", function () {
    window.location.href = "crud/logout.php"
})


buttonBackHistory.addEventListener("click", () =>
    history.go(-1)
)

buttonNextHistory.addEventListener("click", () =>
    history.go(1)
)
