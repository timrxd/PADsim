var board = Create2DArray(6);
var activeColor = 'r';	
var infected = [];
var savedBoard = Create2DArray(6);
var delay = 500;
var plusBox = document.getElementById("plus_orbs");

var numMatches = 0;

			
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

	for(var i = 1; i <= 5; i++)  {    // Row
		for(var j = 1; j <= 6; j++) { // Column

			// If its infected and its empty, it means it was just cleared in a match
			if (board[i][j].orb == 'x' && board[i][j].infected) {

				// Number of orbs in match
				numOrbs++;

				// Plus Orbs
				debug(board[i][j].orb + " " + board[i][j].orb.toUpperCase());
				if (board[i][j].orb == board[i][j].orb.toUpperCase())
					numPlusOrbs++;

				// TPAS's
				if(j < 4) { // Horizontal
					if ( (board[i][j+1].orb == 'x' && board[i][j+1].infected) && (board[i][j+2].orb == 'x' && board[i][j+2].infected) &&
						 (board[i][j+3].orb == 'x' && board[i][j+3].infected)  )
						isTPA = true;
				}

				if(i < 3) { // Vertical
					if ( (board[i+1][j].orb == 'x' && board[i+1][j].infected) && (board[i+2][j].orb == 'x' && board[i+2][j].infected) &&
						 (board[i+3][j].orb == 'x' && board[i+3][j].infected)  )
						isTPA = true;
				}

				// Rows
				if (j == 1) { 
					if ( (board[i][j+1].orb == 'x' && board[i][j+1].infected) && (board[i][j+2].orb == 'x' && board[i][j+2].infected) &&
						 (board[i][j+3].orb == 'x' && board[i][j+3].infected) && (board[i][j+4].orb == 'x' && board[i][j+4].infected) &&
						 (board[i][j+5].orb == 'x' && board[i][j+5].infected)  )  
						isRow = true;
				}


			}



			board[i][j].infected = false;
		}
	}

	if(numOrbs > 0) {
		numMatches++;
		if (numOrbs != 4)
			isTPA = false;

		document.getElementById("matches").innerHTML = document.getElementById("matches").innerHTML + 
			"<br>" + (numMatches) + ": Orbs- " + numOrbs + ", +'s- "+ numPlusOrbs + (isRow?", Row":"") + (isTPA?", TPA":"");

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
	document.getElementById("Model").innerHTML = "Meta-board:<br>";
	for(var i = 1; i <= 5; i++) {     // Row
		for(var j = 1; j <= 6; j++)  // Column
		{
			document.getElementById("Model").innerHTML = document.getElementById("Model").innerHTML+"<p style='float:left;width:20px;margin-bottom:0px;margin-top:0px;padding-left:5px'>"+board[i][j].orb+"</p>";
		}
		//document.getElementById("Model").innerHTML = document.getElementById("Model").innerHTML+"<p style='both.clear'><br></p>";
		document.getElementById("Model").innerHTML = document.getElementById("Model").innerHTML+"<br>";
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


