function create(tagName, container, text = null, classs = null, id = null, href = null, src = null) {
    let element = document.createElement(tagName)
    container.appendChild(element)
    if (text)
        element.appendChild(document.createTextNode(text))
    if (classs)
        element.classList.add(classs)
    if (id)
        element.id = id
    if (src)
        element.src = src
    if (href)
        element.href = href
    return element
}

let musicContainer = document.querySelector("#tab_music")

function display(data) {
    let table = create("table", musicContainer, null, "musiqueTable")
    let tr = create("tr", table, null, "trNom")
    create("th", tr, "id")
    create("th", tr, "Titre")
    create("th", tr, "Artiste")
    create("th", tr, "Genre")
    // create("th", tr, "Image")
    create("th", tr, "Musique")

    let trData = create("tr", table, null, "trData")

    create("td", trData, data.id)
    create("td", trData, data.Titre)
    create("td", trData, data.Artiste)
    create("td", trData, data.Genre)
    // let tmp_img = create("td", trData)
    // create("img", tmp_img, null, "img_titre", null, null, data.Image)
    let tmp_music = create("td", trData)
    let tmp_music1 = create("figure", tmp_music)
    let music = create("audio", tmp_music1, null, null, null, null, data.Musique)
    music.setAttribute("controls", "")
}

axios.get("data_music.php").then(response => {
    for (let data of response.data) {
        display(data)
    }
})

