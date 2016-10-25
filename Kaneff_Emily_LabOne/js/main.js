
//on page load event
window.addEventListener("load", (e) => {
	console.log("Page loaded")
	var app = new Assignment();
});

//singleton creation
//allows for only one instance of the application to be running in a single session
class Assignment {
	constructor() {
		console.log("Assignment created");

		//controller reference
		this.controller = new Controller();
	}

	static getInstance() {
		if(!Assignment._instance) {
			Assignment._instance = new Assignment();
			return Assignment._instance;
		} else {
			throw "Assignment already created";
		}
	}
}

class Controller {
	constructor() {
		console.log("Controller activated");

		//model and view references
		this.model = new Model();
		this.view = new View();

		this.booksArr = [];

		//add button event listener
		document.querySelector("form").addEventListener("click", (e) => {
			e.preventDefault();

			//sends event object that contains input fields if button is clicked 
			if (e.target.type == "button") {
				//send information to model for processing
				var bookObj = this.model.createObj();
				//add data object to books array
				this.booksArr.push(bookObj);
				this.getData();
			}
		});		
	}

	getData() {
		//send book object to view for page printing
		this.view.printBooks(this.booksArr);

		//delete buttons
		var deleteBtns = document.querySelectorAll(".delete");
		for (var i = 0; i < deleteBtns.length; i++) {
			deleteBtns[i].addEventListener("click", (e) => {
				var idSplit = Utils.split(e);
				this.view.printBooks(this.model.delete(idSplit[1], this.booksArr));
				this.getData();
			});
		}

		//edit buttons
		var editBtns = document.querySelectorAll(".edit");
		for (var i = 0; i < editBtns.length; i++) {
			editBtns[i].addEventListener("click", (e) => {
				var idSplit = Utils.split(e);
				//this.view.printBooks(this.model.delete(idSplit[1], this.booksArr));
				
			});
		}
	}
}

class Model {
	constructor() {
		console.log("Model activated");
	}

	createObj() {
		//creates and returns data object
		var obj = new Data();
		var formData = document.querySelectorAll("input[type=text]");
		obj.title = formData[0].value;
		obj.author = formData[1].value;
		obj.genre = formData[2].value;

		//clear input fields

		
		return obj;
	}

	delete(id, bookArr) {
		//removes object from array
		bookArr.splice(id, 1);
		return bookArr;
	}
}

class View {
	constructor() {
		console.log("View activated");
	}

	printBooks(data) {
		var content = '';
		for (var i = 0; i < data.length; i++) {
			content += "<h2>Title: " + data[i].title + "</h2>";
			content += "<h3>Author: " + data[i].author + "</h3>";
			content += "<h4>Genre: " + data[i].genre + "</h4>";
			content += "<button class='edit' id='edit_" + i + "'>Edit</button>";
			content += "<button class='delete' id='delete_" + i + "'>Delete</button>";
		}

		//push data with html tags to DOM
		var parent = document.querySelector("#books");
		parent.innerHTML = content;
 
	}

	editForm() {

	}
}

//data class to make objects
class Data {
	constructor() {
		this.title = '';
		this.author = '';
		this.genre = '';
	}
}

class Utils {
	constructor() {
		throw "Don't instiantiate your utils class";
	}

	static split(eventObj) {
		var temp = eventObj.target.id.split("_");
		return temp;
	}
}












