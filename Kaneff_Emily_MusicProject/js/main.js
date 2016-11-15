var eventNode = document.createElement("null");

window.addEventListener("load", (e) => {
	var myApp = new Controller();
});

class Controller {
	constructor() {
		console.log("Controller activated");
		//class instances
		this.model = new Model();
		this.view = new View();

		//local variables
		this.genre = '';
		this.resultsArr = [];
		this.myList = [];

		//hide list 
		$('#myList').hide();

		this.myList = JSON.parse(localStorage.getItem("myList"));
		console.log(this.myList);
		//go button event listener
		document.getElementById("go").addEventListener("click", (e) => {
			e.preventDefault();
			console.log(e);
			this.genre = document.getElementById("search").value;
			document.getElementById("main").style.display = "none";
			document.querySelector("body").style.background = "white";
			document.getElementById("dash").style.display = "block";
			document.querySelector('footer').style.display = "block";
			this.model.getArtists(this.genre);
		});

		//second go button event listener
		document.getElementById("go2").addEventListener("click", (e) => {
			e.preventDefault();
			console.log(e);
			this.genre = document.getElementById("search2").value;
			this.model.getArtists(this.genre);

		});

		//event listener for model data
		eventNode.addEventListener("objectsMade", (e) => {
			this.resultsArr = e.data;
			this.view.pushResults(e.data, this.genre, this.myList);
			this.addListenersOnButtons();
		});

		//my list link event listener
		document.getElementById("showList").addEventListener("click", (e) => {
			e.preventDefault();
			console.log("this fired");
			
			//call My List view
			this.view.showList(this.myList);

			//call delete button creation
			this.addDeleteButtons();

			//display list div
			$('#myList').show("slide", {direction:"down"}, 1000);
			//document.getElementById("myList").style.display = "block";
			
			
			document.getElementById("hide").addEventListener("click", (e) => {
				e.preventDefault();
				$('#myList').hide("slide", {direction:"down"}, 1000);
			});

		});

	}

	addDeleteButtons() {
		var delBtns = document.querySelectorAll(".del");
		//console.log(delBtns);

		delBtns.forEach((el) => {
			el.addEventListener("click", (e) => {
				e.preventDefault();
				//console.log(e.target.id);
				var splitId = Utils.split(e.target.id);
				var temp = this.model.delete(splitId[1], this.myList);

				localStorage.setItem("myList", JSON.stringify(temp));
				//console.log(temp);
				this.view.showList(temp);
				
				document.getElementById("hide").addEventListener("click", (e) => {
					e.preventDefault();
					document.getElementById("myList").style.display = "none";
				});

				this.addDeleteButtons();

				var evt = new Event("objectsMade");
				evt.data = this.resultsArr;
				eventNode.dispatchEvent(evt);
			});
		});
	}

	addListenersOnButtons() {
		var btns = document.querySelectorAll(".add");

		//add event listener for add buttons
		btns.forEach((el) => {

			el.addEventListener("click", (e) => {
				e.preventDefault();

				//split id on each object
				var splitId = Utils.split(e.target.id);
				this.myList.push(this.resultsArr[splitId[1]]);

				///////////////////////////////
				//         LOCAL STORAGE
				//////////////////////////////
				localStorage.setItem("myList", JSON.stringify(this.myList));

				var evt = new Event("objectsMade");
				evt.data = this.resultsArr;
				eventNode.dispatchEvent(evt);
				
			});
		});

	}

}

class Model {
	constructor() {
		console.log("Model activated");	
		this.objArr = [];
		this.originals = [];
		this.finished = 0;
	}

	getArtists(val) {
		var that = this;
		this.objArr = [];
		this.originals = [];
		$.ajax({
			url: "http://api.musicgraph.com/api/v2/artist/search?api_key=3b602394aae53edf5c5ba36cb9b971f9&genre=" + val + "&limit=16",
			type: 'GET',
			dataType: 'json',
			success: function(results) {
				that.originals = results.data;
				that.finished = 0;
				results.data.forEach((el) => {
					that.getImage(el);
				});
			}
		});
	}

	getImage(obj) {
		//console.log(obj);
		var that = this;
		$.ajax({
			url: "https://api.spotify.com/v1/artists/" + obj.spotify_id,
			type: 'GET',
			dataType: 'json',
			success: function(results) {
				that.objArr.push(results);
				that.finished++;
				if (that.finished == that.originals.length) {
					var evt = new Event("objectsMade");
					evt.data = that.objArr;
					eventNode.dispatchEvent(evt);
				}
			}
		});
	}

	delete(id, arr) {
		arr.splice(id, 1);
		return arr;
	}
}

class View {
	constructor() {
		console.log("View activated");
	}

	pushResults(data, genre, myList) {
		//console.log(data);
		document.getElementById("genreName").innerHTML = genre;
		var content = '';
		for (var i=0; i < data.length; i++) {
			var isFav = Utils.findMatchById(data[i],myList);
			content += "<article>";
			content += "<p><div class='images'><img src='" + data[i].images[2].url + "'/></div></p>";
			content += "<h4>" + data[i].name + "</h4>";
			if(isFav){
				content += "<span class='fa fa-check fa-lg'><span>Added to My List</span></span>";
			}else{
				content += "<button class='add' id='add_" + i + "'>Add to My List</button>"
			}
			content += "</article>";
		}

		var parent = document.getElementById("artists");
		parent.innerHTML = content;
	}

	showList(arr) {
		//console.log(arr);
		var content = '';
		content += '<div class="contain">';
		content += '<a href="#" id="hide">X</a>';
		content += '<h1>My List</h1>';
		for (var i=0; i < arr.length; i++) {
			content += "<article>"
			content += "<p><div class='images'><img src='" + arr[i].images[2].url + "'/></div></p>";
			content += "<h4>" + arr[i].name + "</h4>";
			content += "<button class='del' id='delete_" + i + "'>Delete</button>"
			content += "</article>";
		}
		content += '</div>';
		var parent = document.getElementById("myList");
		parent.innerHTML = content;
	}
}

class Utils {
	constructor(){

	}

	static split(id) {
		var temp = id.split("_");
		return temp;
	}

	static findMatchById(obj,arr){
		//checking myList array for instances of objects based on unique object ids
		var isMatch = false;
		for (var j = 0 ; j < arr.length; j++){
			if(arr[j].id == obj.id){
				isMatch = true;
				break;
			}
		}
		return isMatch
	}
}