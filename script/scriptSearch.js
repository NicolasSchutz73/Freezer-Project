var mot = document.querySelector('.searchTerm')

mot.addEventListener("keyup", () => {
	chercheMusic(mot.value);
	cherchePlaylist(mot.value);
})

//Function chercher musique et playlist dans base de données 

function chercheMusic(recherche = null) {
	//page index
	if (page=="accueil"){
		axios.get("crud/getallmusics.php?search=" + recherche)
			.then(function (response) {
				let musics = response.data
				removeAllChild(musiquesContainer);
				if(musics.length==0){
					rechercheVide(musiquesContainer,"musiques")
				} else {
					afficheMusiques(musics);
				}
			})
	//page playlist
	} else if(page=="playlist") {
	axios.get("crud/getmusiquesplaylist.php?id="+ idsPlaylist +"&search="+recherche)
	.then(function (response) {
			let musics = response.data;
			removeAllChild(musiquesContainer);
			if(musics.length==0){
				rechercheVide(musiquesContainer,"musiques")
			} else {
				afficheMusiques(musics);
			}
	})
	}
}


function cherchePlaylist(recherche = null) {
	if (page=="accueil"){
		axios.get("crud/getallplaylists.php?search=" + recherche)
		.then(function (response) {

			let playlists = response.data
			removeAllChild(document.querySelector(".playlistsContainerWrap"));
			affichePlaylists(playlists)
		})
	}
}


function removeAllChild(parent) {
	while (parent.firstChild) {
		parent.firstChild.remove()
	}
}

function rechercheVide(container,type){
	let rechercheVideContainer = create("div",container,null,"empty-search")
	create("p",rechercheVideContainer,"Pas de "+type+" portant ce nom")
}
