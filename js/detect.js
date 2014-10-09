function Case(){
	this.casebook;
	this.indexPeople;
	this.indexLocation;
}

Case.prototype.processEditor = function(){
	var codeElem = document.getElementById("code");
	var code = codeElem.innerText.split('\n');
	this.compile(code);
	this.render();
}

Case.prototype.compile = function(code){
	this.indexPeople = new Array();
	this.indexTags = new Array();
	this.indexLocation = new Array();
	this.casebook = new Array();

	var location = "";
	for(l in code){
		var line = code[l];
		if(line[0] == ":"){
			location = line;
		}else if(location != ""){
			var clue = new Clue(location, line);
			var id = this.casebook.push(clue)-1;
			if(!this.indexLocation[location]){
				this.indexLocation[location] = new Array();
			}
			this.indexLocation[location].push(id);

			for(p in clue.people){
				var person = clue.people[p];
				if(!this.indexPeople[person]){
					this.indexPeople[person] = new Array();
				}
				this.indexPeople[person].push(id);
			}

			for(t in clue.tags){
				var tag = clue.tags[t];
				if(!this.indexTags[tag]){
					this.indexTags[tag] = new Array();
				}
				this.indexTags[tag].push(id);
			}
		}
	}
}

Case.prototype.render = function(){
	var peopleElem = document.getElementById("people-data");
	peopleElem.innerText = "";
	var gridPeople = this.generateGrid(this.indexPeople);
	for(r in gridPeople){
		var row = document.createElement("div");
		row.className = "row";
		for(c in gridPeople[r]){
			row.appendChild(gridPeople[r][c]);
		}
		peopleElem.appendChild(row);
	}

	var tagsElem = document.getElementById("tags-data");
	tagsElem.innerText = "";
	var gridTags = this.generateGrid(this.indexTags);
	for(r in gridTags){
		var row = document.createElement("div");
		row.className = "row";
		for(c in gridTags[r]){
			row.appendChild(gridTags[r][c]);
		}
		tagsElem.appendChild(row);
	}

	var historyElem = document.getElementById("history-data");
	historyElem.innerText = "";
	var gridHistory = this.generateGrid(this.indexLocation);
	for(r in gridHistory){
		var row = document.createElement("div");
		row.className = "row";
		for(c in gridHistory[r]){
			row.appendChild(gridHistory[r][c]);
		}
		historyElem.appendChild(row);
	}
}

Case.prototype.generateGrid = function(index){
	var result = [];
	var x = 0;
	var n = 0;
	for(p in index){
		var cardElem = this.createCard(p, index[p]);
		if(!result[x]){
			result.push([]);
		}

		result[x].push(cardElem);
		if(n == 1){
			n = 0;
			x++;
		}else{
			n++;
		}
	}
	console.log(result);
	return result;
}

Case.prototype.createCard = function(title, list){
	var cellElem = document.createElement("div");
	cellElem.className = "col-md-6";

	var cardElem = document.createElement("div");
	cardElem.id = title.substr(1);
	cardElem.className = "panel panel-default";
	cellElem.appendChild(cardElem);

	var headingElem = document.createElement("div");
	headingElem.className = "panel-heading";
	cardElem.appendChild(headingElem);

	var titleElem = document.createElement("h3");
	titleElem.className = "panel-title";
	titleElem.innerText = title;
	headingElem.appendChild(titleElem); 

	var listElem = document.createElement("ul");
	listElem.className = "list-group";
	cardElem.appendChild(listElem);

	for(item in list){
		var itemElem = document.createElement("li");
		itemElem.className = "list-group-item";
		var clue = this.casebook[list[item]];
		var clueHTML = clue.badgeHTML;
		clueHTML += clue.messageHTML;
		itemElem.innerHTML = clueHTML;
		listElem.appendChild(itemElem);
	}
	return cellElem;
}

Case.prototype.updateEditor = function(){
	$("#code").removeClass("prettyprinted");
	PR.prettyPrint();
}

var Case = new Case();

function Clue(location, message){
	this.message = message;
	this.messageHTML = message.replace(/([@#])(\w+)/g, "<a href=\"#$2\" onclick=\"clickClue('$1', '$2')\">$1$2</a>");
	this.badgeHTML = "<span class=\"badge\"><a href=\"#"+location.substr(1)+"\" onclick=\"clickClue(':', '"+location.substr(1)+"')\">"+location.substr(1)+"</a></span>";
	this.people = message.match(/@\w+/g);
	this.tags = message.match(/#\w+/g);
	this.location = location;
}

function clickClue(type, id){
	var tab = "";
	switch(type){
		case ":": tab = "history";
				break;
		case "@": tab = "people";
				break;
		case "#": tab = "tags";
				break;
		default: tab = "editor";
				break;


	}
	$('#main-menu a[href="#'+tab+'"]').tab("show")
	$(".panel").removeClass("panel-primary")
	$("#"+id).addClass("panel-primary");
}