var eventNode = document.createElement("null");

window.addEventListener("load", (e) => {
	var myApp = new Controller();
});

class Controller {
	constructor() {
		console.log("Controller activated");
		this.model = new Model();
		this.view = new View();
		//go button event listener
		document.getElementById("go").addEventListener("click", (e) => {
			e.preventDefault();
			console.log(e);
			var genreVal = document.getElementById("search").value;
			document.getElementById("main").style.display = "none";
			document.querySelector("body").style.background = "white";
			document.getElementById("dash").style.display = "block";
			this.model.getArtists(genreVal);

			eventNode.addEventListener("dataGot", (e) => {
				//console.log(e.data);
				var newObjs = [];
				e.data.forEach((el) => {
					var temp = this.model.getImage(el);
				});
				eventNode.addEventListener("newObjMade", (e) => {
					//onsole.log(e.data);
					newObjs.push(e.data);
					this.view.pushResults(newObjs);
				});
			});
		});


		document.getElementById("go2").addEventListener("click", (e) => {
			e.preventDefault();
			console.log(e);
			var genreVal = document.getElementById("search2").value;
			this.model.getArtists(genreVal);

			eventNode.addEventListener("dataGot", (e) => {
				console.log(e.data);
				var newObjs = [];
				e.data.forEach((el) => {
					var temp = this.model.getImage(el);
				});
				eventNode.addEventListener("newObjMade", (e) => {
					newObjs.push(e.data);
					this.view.pushResults(newObjs);
				});
			});
			console.log(eventNode);
		});
	}

}

class Model {
	constructor() {
		console.log("Model activated");	
	}

	getArtists(val) {
		var that = this;
		//var newObj = {};
		$.ajax({
			url: "http://api.musicgraph.com/api/v2/artist/search?api_key=3b602394aae53edf5c5ba36cb9b971f9&genre=" + val + "&limit=2",
			type: 'GET',
			dataType: 'json',
			success: function(results) {
				//console.log(results);
				//newObj = results;
				//that.getImage(results.data);
				var evt = new Event("dataGot");
				evt.data = results.data;
				eventNode.dispatchEvent(evt);

			}
		});

		//return newObj;
	}

	getImage(obj) {
		$.ajax({
			url: "https://api.spotify.com/v1/artists/" + obj.spotify_id,
			type: 'GET',
			dataType: 'json',
			success: function(results) {
				var evt = new Event("newObjMade");
				evt.data = results;
				eventNode.dispatchEvent(evt);
			}
		});
	}
}

class View {
	constructor() {
		console.log("View activated");
	}

	pushResults(data) {
		console.log(data);
		var content = '';
		data.forEach((el) => {
			content += "<article>"
			content += "<p><img src='" + el.images[2].url + "'/></p>";
			content += "<h3>" + el.name + "</h3>";
			content += "</article>";
		});

		var parent = document.getElementById("artists");
		parent.innerHTML = content;
	}

}