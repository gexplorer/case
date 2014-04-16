function Case(){
	this.regPeople = /@\w+/g;

	this.messages;
	this.book;
	this.indexPeople;
	this.indexClue;
}

Case.prototype.processEditor = function(){
	var code = document.getElementById("code");
	var lines = code.innerText.split('\n');
	this.parseText(lines);
}

Case.prototype.parseText = function(lines){
	this.indexPeople = new Array();
	this.indexClue = new Array();
	this.book = new Array();

	var clue = "";
	for(l in lines){
		var line = lines[l];
		if(line[0] == ":"){
			clue = line;
		}else if(clue != ""){
			var people = this.extractPeople(line);
			var elem = {
				"message" : line,
				"messageHTML": line.replace(/(@\w+)/g, "<a href=\"#$1\">$1</a>"),
				"badgeHTML" : "<span class=\"badge\"><a href=\"#"+clue+"\">"+clue+"</a></span>",
				"people" : people,
				"clue"	: clue
			};
			var id = this.book.push(elem)-1;
			if(!this.indexClue[clue]){
				this.indexClue[clue] = new Array();
			}
			this.indexClue[clue].push(id);

			for(p in people){
				var person = people[p];
				if(!this.indexPeople[person]){
					this.indexPeople[person] = new Array();
				}
				this.indexPeople[person].push(id);
			}
		}
	}
	
	var peopleElem = document.getElementById("people");
	peopleElem.innerText = "";
	for(p in this.indexPeople){
		var cardElem = this.createCard(p, this.indexPeople[p]);
		peopleElem.appendChild(cardElem);
	}

	var historyElem = document.getElementById("history");
	historyElem.innerText = "";
	for(c in this.indexClue){
		var cardElem = this.createCard(c, this.indexClue[c]);
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
		var tmpClue = this.book[list[item]].messageHTML
		tmpClue += this.book[list[item]].badgeHTML;
		itemElem.innerHTML = tmpClue;
		listElem.appendChild(itemElem);
	}
	return cardElem;
}

Case.prototype.extractPeople = function(text){
	return text.match(this.regPeople);
}

Case.prototype.updateEditor = function(){
	$("#code").removeClass("prettyprinted");
	PR.prettyPrint();
}

var Case = new Case();