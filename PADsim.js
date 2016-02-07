var board = Create2DArray(6);
var activeColor = 'r';	
var savedBoard = Create2DArray(6);
var delay = 500;
var plusBox = document.getElementById("plus_orbs");

var numMatches = 0;
var matchArray = [];

			
function runSolve() {

	document.getElementById("matches").innerHTML = "Matches:";
	numMatches = 0;

	for(var i = 1; i <= 5; i++)  {    // Row
		for(var j = 1; j <= 6; j++) { // Column
			savedBoard[i][j] = board[i][j].orb;
			//debug(savedBoard[i][j].orb);
		}
	}

	refresh();
	solve();
}

function solve() {
	
	var settled = true;
	for(i = 1; i <= 5; i++)  {    // Row
		for(j = 1; j <= 6; j++) { // Column
			groupOrbs(i,j);	
			if (settled)				
				settled = match();
			else
				match();
			disinfect();
		}
	}

	refresh();
	//debug(settled);
	if (!settled) 
		//gravity();
		setTimeout(function(){gravLoop();},delay);
	
}

function gravLoop () {
	var finished = true;
	var settled = true;
	for(var r = 5; r > 0; r--) {
		for(var c = 1; c <= 6; c++) {
			if (board[r][c].orb == 'x') {
				if(r==1) {
					// Blank or add random
					// If random, finished = false
				}
				else if(board[r-1][c].orb != 'x') {
					board[r][c].orb = board[r-1][c].orb;
					board[r-1][c].orb = 'x';
					settled = false;
					finished = false;
				}
			}
		}
	}	
	refresh();
	if (!settled) {
		setTimeout(function() {
			gravLoop();
		}, delay);
	}
	else {
		solve();
		}

		
	//debug("end");
}




// All same-color orbs connected to base orb are lumped into a match
function groupOrbs(a, b) {
	
	if (!board[a][b].infected && board[a][b].orb != 'x') {
		infect(a,b);
	}			
}

// Identify possible matches as infected
function infect(x,y) {
	
	var color = board[x][y].orb.toLowerCase();
	board[x][y].infected = true;
	
	// Up
	if(x != 1) 
		if (board[x-1][y].orb.toLowerCase() == color && !board[x-1][y].infected)
			infect(x-1,y);
		
	// Down
	if(x != 5) 
		if (board[x+1][y].orb.toLowerCase() == color && !board[x+1][y].infected)
			infect(x+1,y);
						
	// Left
	if(y != 1) 
		if (board[x][y-1].orb.toLowerCase() == color && !board[x][y-1].infected)
			infect(x,y-1);
						
	// Right
	if(y != 6) 
		if (board[x][y+1].orb.toLowerCase() == color && !board[x][y+1].infected)
			infect(x,y+1);			
}

// Then, check every infected orb for a match-3, 
// If it succeeds moves onto final list to be eliminated, 
//	along with target and middle orb
function match() {
	var settled = true;
	for(var i = 1; i <= 5; i++) {     // Row
		for(var j = 1; j <= 6; j++)  // Column
		{
			if (board[i][j].infected) {
				// Left
				if (j > 2) 
					if (board[i][j-1].infected && board[i][j-2].infected) {
						board[i][j].match = true; 
						board[i][j-1].match = true; 
						board[i][j-2].match = true; 
						settled = false;
					}
				
				// Right
				if (j < 5) 
					if (board[i][j+1].infected && board[i][j+2].infected){
						board[i][j].match = true; 
						board[i][j+1].match = true; 
						board[i][j+2].match = true; 
						settled = false;
					}
				
				// Up
				if (i > 2) 
					if (board[i-1][j].infected && board[i-2][j].infected){
						board[i][j].match = true; 
						board[i-1][j].match = true; 
						board[i-2][j].match = true; 
						settled = false;
					}
				
				// Down
				if (i < 4) 
					if (board[i+1][j].infected && board[i+2][j].infected){
						board[i][j].match = true; 
						board[i+1][j].match = true; 
						board[i+2][j].match = true; 
						settled = false;
					}
			}
		}
	}
	//debug(settled);
	return settled;
}

function disinfect() {
	var numOrbs = 0;
	var numPlusOrbs = 0;
	var isTPA = false;
	var isRow = false;
	var color = "Blank";

	for(var i = 1; i <= 5; i++)  {    // Row
		for(var j = 1; j <= 6; j++) { // Column

			// If its infected and its empty, it means it was just cleared in a match
			if (board[i][j].match) {

				// Get color of match
				switch(board[i][j].orb.toLowerCase()) {
					case "r":						
						color = "red"
						break;
					case "b":
						color = "blue"
						break;
					case "g":
						color = "green"
						break;
					case "d":
						color = "dark"
						break;
					case "l":
						color = "light"
						break;
					case "h":
						color = "heart"
						break;					
				}		

				// Number of orbs in match
				numOrbs++;

				// Plus Orbs
				if (board[i][j].orb == board[i][j].orb.toUpperCase())
					numPlusOrbs++;

				// TPAS's
				if(j < 4) { // Horizontal
					if ( (board[i][j+1].match) && (board[i][j+2].match) && (board[i][j+3].match)  )
						isTPA = true;
				}

				if(i < 3) { // Vertical
					if ( (board[i+1][j].match) && (board[i+2][j].match) && (board[i+3][j].match)  )
						isTPA = true;
				}

				// Rows
				if (j == 1) { 
					if ( (board[i][j+1].match) && (board[i][j+2].match) && (board[i][j+3].match) && 
						(board[i][j+4].match) && (board[i][j+5].match)  )  
						isRow = true;
				}


			}
			if(board[i][j].match)
				board[i][j].orb = 'x';
			board[i][j].match = false;
			board[i][j].infected = false;
		}
	}

	if(numOrbs > 0) {
		numMatches++;
		if (numOrbs != 4)
			isTPA = false;

		// CHECK IF THE CONNECTION BUG INLCUDES THE EXTRA ORB IN NUM_ORBS ON REAL PAD

		document.getElementById("matches").innerHTML = document.getElementById("matches").innerHTML + 
			"<br>" + (numMatches) + ": " + color + " Orbs- " + numOrbs + ", +'s- "+ numPlusOrbs + (isRow?", Row":"") + (isTPA?", TPA":"");

		matchArray[numMatches] = new matchObject(color, numOrbs, numPlusOrbs, isRow, isTPA);
		calcDamage();

	}
}

// Prototype for a match object
function matchObject(c, n, p, r, t) {
	this.orbColor = c;
	this.numOrbs = n;
	this.numPlusOrbs = p;
	this.isRow = r;
	this.isTPA = t;
}

function calcDamage() {

	var mult = parseFloat(document.getElementById("L_mult").value) * parseFloat(document.getElementById("F_mult").value);
	var activeMult = parseFloat(document.getElementById("A_mult").value);

	var redE = 0, blueE = 0, greenE = 0, darkE = 0, lightE = 0;
	var redRows = 0, blueRows = 0, greenRows = 0, darkRows = 0, lightRows = 0;

	for(var r = 1; r <= 6; r++) {
		redE = redE +  parseInt(document.getElementById("card"+r+"_orbRed").value);
		blueE = blueE +  parseInt(document.getElementById("card"+r+"_orbBlue").value);
		greenE = greenE +  parseInt(document.getElementById("card"+r+"_orbGreen").value);
		darkE = darkE +  parseInt(document.getElementById("card"+r+"_orbDark").value);
		lightE = lightE +  parseInt(document.getElementById("card"+r+"_orbLight").value);


		switch (document.getElementById("card"+r+"_main").value) {
			case "red":
				redRows = redRows + parseInt(document.getElementById("card"+r+"Row_Main").value);
				break;
			case "blue":
				blueRows = blueRows + parseInt(document.getElementById("card"+r+"Row_Main").value);
				break;
			case "green":
				greenRows = greenRows + parseInt(document.getElementById("card"+r+"Row_Main").value);
				break;
			case "dark":
				darkRows = darkRows + parseInt(document.getElementById("card"+r+"Row_Main").value);
				break;
			case "light":
				lightRows = lightRows + parseInt(document.getElementById("card"+r+"Row_Main").value);
				break;
		}
		switch (document.getElementById("card"+r+"_sub").value) {
			case "red":
				redRows = redRows + parseInt(document.getElementById("card"+r+"Row_Sub").value);
				break;
			case "blue":
				blueRows = blueRows + parseInt(document.getElementById("card"+r+"Row_Sub").value);
				break;
			case "green":
				greenRows = greenRows + parseInt(document.getElementById("card"+r+"Row_Sub").value);
				break;
			case "dark":
				darkRows = darkRows + parseInt(document.getElementById("card"+r+"Row_Sub").value);
				break;
			case "light":
				lightRows = lightRows + parseInt(document.getElementById("card"+r+"Row_Sub").value);
				break;
		}
	}

	var grandTotal = 0;
	
	for(var c = 1; c <= 6; c++) {
		
		var atk = parseInt(document.getElementById("card"+c+"ATK").value);
		var subTotal = 0; 	// Just for counting
		var altSubTotal = 0;

		var total = 0;	 	// Main color
		var altTotal = 0; 	// Sub color

		var mainColor = document.getElementById("card"+c+"_main").value;
		var subColor = document.getElementById("card"+c+"_sub").value;

		var numTPAs = document.getElementById("card"+c+"TPA").value;
		var numMainRows = 0;
		var numSubRows = 0;

		for(var n = 1; n <= numMatches; n++) {
			if (matchArray[n].orbColor == mainColor) {
				subTotal = atk + (atk * ((matchArray[n].numOrbs-3)*.25) );
				switch(mainColor) {
					case "red":
						subTotal = subTotal * ( (1.0 + (0.06 * matchArray[n].numPlusOrbs) )  * ( 1.0 + (0.04 * redE) )   ) ;
						break;
					case "blue":
						subTotal = subTotal * ( (1.0 + (0.06 * matchArray[n].numPlusOrbs) )  * ( 1.0 + (0.04 * blueE) )   ) ;
						break;
					case "green":
						subTotal = subTotal * ( (1.0 + (0.06 * matchArray[n].numPlusOrbs) )  * ( 1.0 + (0.04 * greenE) )   ) ;
						break;
					case "dark":
						subTotal = subTotal * ( (1.0 + (0.06 * matchArray[n].numPlusOrbs) )  * ( 1.0 + (0.04 * darkE) )   ) ;
						break;
					case "light":
						subTotal = subTotal * ( (1.0 + (0.06 * matchArray[n].numPlusOrbs) )  * ( 1.0 + (0.04 * lightE) )   ) ;
						break;
				}
				subTotal = subTotal * Math.pow(1.5,numTPAs);
				total = total + subTotal;

				if(matchArray[n].isRow)
					numMainRows++;
			}

			var subMult = 0.3;
			if (mainColor == subColor)
				subMult = 0.1;

			if (matchArray[n].orbColor == subColor) {
				altSubTotal = (atk*0.3) + ((atk*0.3) * ((matchArray[n].numOrbs-3)*.25) );
				if (matchArray[n].numPlusOrbs > 0) {
					switch(subColor) {
						case "red":
							altSubTotal = altSubTotal * ( (1.0 + (0.06 * matchArray[n].numPlusOrbs) )  * ( 1.0 + (0.04 * redE) )   ) ;
							break;
						case "blue":
							altSubTotal = altSubTotal * ( (1.0 + (0.06 * matchArray[n].numPlusOrbs) )  * ( 1.0 + (0.04 * blueE) )   ) ;
							break;
						case "green":
							altSubTotal = altSubTotal * ( (1.0 + (0.06 * matchArray[n].numPlusOrbs) )  * ( 1.0 + (0.04 * greenE) )   ) ;
							break;
						case "dark":
							altSubTotal = altSubTotal * ( (1.0 + (0.06 * matchArray[n].numPlusOrbs) )  * ( 1.0 + (0.04 * darkE) )   ) ;
							break;
						case "light":
							altSubTotal = altSubTotal * ( (1.0 + (0.06 * matchArray[n].numPlusOrbs) )  * ( 1.0 + (0.04 * lightE) )   ) ;
							break;
					}
				}
				altSubTotal = altSubTotal * Math.pow(1.5,numTPAs);
				altTotal = altTotal + altSubTotal;

				if(matchArray[n].isRow)
					numSubRows++;
			}


		}

		switch(mainColor) {
			case "red":
				total = total + (total * (redRows*0.1) * numMainRows);
				break;
			case "blue":
				total = total + (total * (blueRows*0.1) * numMainRows);
				break;
			case "green":
				total = total + (total * (greenRows*0.1) * numMainRows);
				break;
			case "dark":
				total = total + (total * (darkRows*0.1) * numMainRows);
				break;
			case "light":
				total = total + (total * (lightRows*0.1) * numMainRows);
				break;
		}
		switch(subColor) {
			case "red":
				altTotal = altTotal + (altTotal * (redRows*0.1) * numSubRows);
				break;
			case "blue":
				altTotal = altTotal + (altTotal * (blueRows*0.1) * numSubRows);
				break;
			case "green":
				altTotal = altTotal + (altTotal * (greenRows*0.1) * numSubRows);
				break;
			case "dark":
				altTotal = altTotal + (altTotal * (darkRows*0.1) * numSubRows);
				break;
			case "light":
				altTotal = altTotal + (altTotal * (lightRows*0.1) * numSubRows);
				break;
		}




		total = total + (total * ((numMatches-1)*.25));
		total = total * mult * activeMult;

		altTotal = altTotal + (altTotal * ((numMatches-1)*.25));
		altTotal = altTotal * mult * activeMult;

		document.getElementById("card"+c+"DMG").innerHTML = total.toFixed(2);
		document.getElementById("card"+c+"DMG_sub").innerHTML = altTotal.toFixed(2);


		grandTotal = grandTotal + total + altTotal;
		document.getElementById("grandTotal").innerHTML = "Total Damage: "+grandTotal.toFixed(2);

	}





}



// Reset the board state
function resetBoard() {
	for(var i = 1; i <= 5; i++)      // Row
		for(var j = 1; j <= 6; j++)  // Column
		{
			board[i][j].orb = savedBoard[i][j];	
		}
		refresh();
}
			
// Converts the entire board to the active color
function fullBoard() {
	for(var i = 1; i <= 5; i++)      // Row
		for(var j = 1; j <= 6; j++)  // Column
		{
			board[i][j].orb = activeColor;	
		}
		refresh();
}
			
// Changes the active color
function changeOrb(selectedOrb) {
	selectedOrb.orb = activeColor;
	refresh();
}

// Highlights the active color
function selectColor(color) {

	// Clear all to start
	document.getElementById("red").src = 'red_orb.png';
	document.getElementById("blue").src = 'blue_orb.png';
	document.getElementById("green").src = 'green_orb.png';
	document.getElementById("light").src = 'light_orb.png';
	document.getElementById("dark").src = 'dark_orb.png';
	document.getElementById("heart").src = 'heart_orb.png';
				
	if (document.getElementById("plus_orbs").checked == true)
		activeColor = color.toUpperCase();	
	else
		activeColor = color.toLowerCase();
	
	// Assign active color
	switch(color.toLowerCase()) {
		case "r":						
			document.getElementById("red").src = 'red_glow.png';
			break;
		case "b":
			document.getElementById("blue").src = 'blue_glow.png';
			break;
		case "g":
			document.getElementById("green").src = 'green_glow.png';
			break;
		case "d":
			document.getElementById("dark").src = 'dark_glow.png';
			break;
		case "l":
			document.getElementById("light").src = 'light_glow.png';
			break;
		case "h":
			document.getElementById("heart").src = 'heart_glow.png';
			break;					
	}				
}

// Runs when page loads
function startup() {

	debug("startup successful");					
	
	// Initialize the board, linking the board 2D Array to the images and meta-board
	for(var i = 1; i <= 5; i++)      // Row
		for(var j = 1; j <= 6; j++)  // Column
		{
			board[i][j] = document.getElementById(""+i+j);
			board[i][j].src = 'red_orb.png';
			board[i][j].orb = 'r';
			board[i][j].setAttribute('onclick','changeOrb(this)');
			board[i][j].infected = false;
			board[i][j].match = false;
		}
		
	// Start off fresh
	randomize();				
	for(var i = 1; i <= 5; i++)  {    // Row
		for(var j = 1; j <= 6; j++) { // Column
			savedBoard[i][j] = board[i][j].orb;
			//debug(savedBoard[i][j].orb);
		}
	}
	refresh();				
	selectColor("r");


	document.getElementById("card1_main").value = "light";
	document.getElementById("card2_main").value = "dark";
	updateColors();
	
	debug(", startup 100%");				

}

// Refresh all images according to their inner orb colours
function refresh() {
	for(var i = 1; i <= 5; i++)      // Row
		for(var j = 1; j <= 6; j++)  // Column
		{					
			switch(board[i][j].orb) {
				case 'r':	
					board[i][j].src = 'red_orb.png';		
					break;
				case 'b':	
					board[i][j].src = 'blue_orb.png';		
					break;
				case 'g':	
					board[i][j].src = 'green_orb.png';		
					break;
				case 'd':	
					board[i][j].src = 'dark_orb.png';		
					break;
				case 'l':	
					board[i][j].src = 'light_orb.png';		
					break;
				case 'h':	
					board[i][j].src = 'heart_orb.png';	
					break;
				case 'R':	
					board[i][j].src = 'red_plus.png';		
					break;
				case 'B':	
					board[i][j].src = 'blue_plus.png';		
					break;
				case 'G':	
					board[i][j].src = 'green_plus.png';		
					break;
				case 'D':	
					board[i][j].src = 'dark_plus.png';		
					break;
				case 'L':	
					board[i][j].src = 'light_plus.png';		
					break;
				case 'H':	
					board[i][j].src = 'heart_plus.png';	
					break;
				case 'x':
					board[i][j].src = "empty.png";
					break;							
			}											
		}	
	

	/*	
		META BOARD - prints a grid of the orb values in the board array

	document.getElementById("Model").innerHTML = "Meta-board:<br>";
	for(var i = 1; i <= 5; i++) {     // Row
		for(var j = 1; j <= 6; j++)  // Column
		{
			document.getElementById("Model").innerHTML = document.getElementById("Model").innerHTML+"<p style='float:left;width:20px;margin-bottom:0px;margin-top:0px;padding-left:5px'>"+board[i][j].orb+"</p>";
		}
		//document.getElementById("Model").innerHTML = document.getElementById("Model").innerHTML+"<p style='both.clear'><br></p>";
		document.getElementById("Model").innerHTML = document.getElementById("Model").innerHTML+"<br>";
	}			
	*/	


}

function updateColors() {
	for(var c = 1; c <= 6; c++) {
		
		var mainType = document.getElementById("card"+c+"_main").value;
		var subType = document.getElementById("card"+c+"_sub").value;

		switch(mainType) {
			case "red":
				document.getElementById("card"+c+"Row_Main").style.background = "#FF6666";				
				document.getElementById("card"+c+"DMG").style.color = "red";
				break;
			case "blue":
				document.getElementById("card"+c+"Row_Main").style.background = "lightblue";
				document.getElementById("card"+c+"DMG").style.color = "blue";
				break;
			case "green":
				document.getElementById("card"+c+"Row_Main").style.background = "lightgreen";
				document.getElementById("card"+c+"DMG").style.color = "green";
				break;
			case "dark":
				document.getElementById("card"+c+"Row_Main").style.background = "#CC66FF";
				document.getElementById("card"+c+"DMG").style.color = "purple";
				break;
			case "light":
				document.getElementById("card"+c+"Row_Main").style.background = "#FFFF66";
				document.getElementById("card"+c+"DMG").style.color = "#FF9900";
				break;			
		}

		switch(subType) {
			case "red":
				document.getElementById("card"+c+"Row_Sub").style.background = "#FF6666";				
				document.getElementById("card"+c+"DMG_sub").style.color = "red";
				break;
			case "blue":
				document.getElementById("card"+c+"Row_Sub").style.background = "lightblue";
				document.getElementById("card"+c+"DMG_sub").style.color = "blue";
				break;
			case "green":
				document.getElementById("card"+c+"Row_Sub").style.background = "lightgreen";
				document.getElementById("card"+c+"DMG_sub").style.color = "green";
				break;
			case "dark":
				document.getElementById("card"+c+"Row_Sub").style.background = "#CC66FF";
				document.getElementById("card"+c+"DMG_sub").style.color = "purple";
				break;
			case "light":
				document.getElementById("card"+c+"Row_Sub").style.background = "#FFFF66";
				document.getElementById("card"+c+"DMG_sub").style.color = "#FF9900";
				break;			
		}


	}


}

// Randomize the orbs
function randomize() {
	for(var i = 1; i <= 5; i++)      // Row
		for(var j = 1; j <= 6; j++)  // Column
		{					
			switch(Math.floor(Math.random()*6)+1) {
				case 1:	
					board[i][j].orb = 'r';		
					break;
				case 2:	
					board[i][j].orb = 'b';		
					break;
				case 3:	
					board[i][j].orb = 'g';		
					break;
				case 4:	
					board[i][j].orb = 'd';		
					break;
				case 5:	
					board[i][j].orb = 'l';		
					break;
				case 6:	
					board[i][j].orb = 'h';		
					break;							
			}
								
		}		
		refresh();
}


