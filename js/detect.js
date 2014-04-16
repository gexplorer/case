	var regPeople = /@\w+/g;

	var messages;
	var history;
	var byPeople;
	var byClue;

	function processEditor(){
		var code = document.getElementById("code");
		var lines = code.innerText.split('\n');
		parseText(lines);
	}

	function parseText(lines){
		byPeople = new Array();
		byClue = new Array();
		history = new Array();

		var clue = "";
		for(l in lines){
			var line = lines[l];
			if(line[0] == ":"){
				clue = line;
			}else if(clue != ""){
				var people = extractPeople(line);
				var elem = {
					"message" : line,
					"messageHTML": line.replace(/(@\w+)/g, "<a href=\"#$1\">$1</a>"),
					"badgeHTML" : "<span class=\"badge\"><a href=\"#"+clue+"\">"+clue+"</a></span>",
					"people" : people,
					"clue"	: clue
				};
				var id = history.push(elem)-1;
				if(!byClue[clue]){
					byClue[clue] = new Array();
				}
				byClue[clue].push(id);

				for(p in people){
					var person = people[p];
					if(!byPeople[person]){
						byPeople[person] = new Array();
					}
					byPeople[person].push(id);
				}
			}
		}
		
		var peopleElem = document.getElementById("people");
		peopleElem.innerText = "";
		for(p in byPeople){
			var cardElem = createCard(p, byPeople[p]);
			peopleElem.appendChild(cardElem);
		}

		var historyElem = document.getElementById("history");
		historyElem.innerText = "";
		for(c in byClue){
			var cardElem = createCard(c, byClue[c]);
			historyElem.appendChild(cardElem);
		}
	}

	function createCard(title, list){
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
			var tmpClue = history[list[item]].messageHTML
			tmpClue += history[list[item]].badgeHTML;
			itemElem.innerHTML = tmpClue;
			listElem.appendChild(itemElem);
		}
		return cardElem;
	}

	function extractPeople(text){
		return text.match(regPeople);
	}