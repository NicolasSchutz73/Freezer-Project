var mot = document.querySelector('.searchTerm')

mot.addEventListener("keyup", () => {
	chercheMusic(mot.value);
	cherchePlaylist(mot.value);
})

//Function chercher musique et playlist dans base de données 

function chercheMusic(recherche = null) {
	axios.get("crud/getallmusics.php?search=" + recherche)
		.then(function (response) {
			let musics = response.data
			removeAllChild(musiquesContainer);
			afficheMusiques(musics);
		})
}


function cherchePlaylist(recherche = null) {
	axios.get("crud/getallplaylists.php?search=" + recherche)
		.then(function (response) {

			let playlists = response.data
			removeAllChild(playlistsContainer);
			affichePlaylists(playlists)
		})
}


function removeAllChild(parent) {
	while (parent.firstChild) {
		parent.firstChild.remove()
	}
}
