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
		}
	}
}

Case.prototype.render = function(){
	var peopleElem = document.getElementById("people-data");
	peopleElem.innerText = "";
	for(p in this.indexPeople){
		var cardElem = this.createCard(p, this.indexPeople[p]);
		peopleElem.appendChild(cardElem);
	}

	var historyElem = document.getElementById("history-data");
	historyElem.innerText = "";
	for(l in this.indexLocation){
		var cardElem = this.createCard(l, this.indexLocation[l]);
		historyElem.appendChild(cardElem);
	}
}

Case.prototype.createCard = function(title, list){
	var cardElem = document.createElement("div");
	cardElem.id = title;
	cardElem.className = "panel panel-default";

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
		var clueHTML = clue.messageHTML
		clueHTML += clue.badgeHTML;
		itemElem.innerHTML = clueHTML;
		listElem.appendChild(itemElem);
	}
	return cardElem;
}

Case.prototype.updateEditor = function(){
	$("#code").removeClass("prettyprinted");
	PR.prettyPrint();
}

var Case = new Case();

function Clue(location, message){
	this.message = message;
	this.messageHTML = message.replace(/(@\w+)/g, "<a href=\"#$1\">$1</a>");
	this.badgeHTML = "<span class=\"badge\"><a href=\"#"+location+"\">"+location+"</a></span>";
	this.people = message.match(/@\w+/g);
	//this.tags = message.match(/#\w+/g);
	this.location = location;
}