function Create2DArray(rows) {
  var arr = [];

  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }

  return arr;
}

function debug(msg) {				
	document.getElementById("debug").innerHTML = document.getElementById("debug").innerHTML+" -"+msg;	
}

/* Scraps

Layering Images:
		<div style="padding-left:20px">
			<div style="float:left;padding-top:15px;padding-left:5px;padding-right5px">Orb Types:</div> 
			  
			<div style="float:left;width:50px"><img src="red_orb.png"><img id="red" onclick=selectColor("r") style="position:relative; top:-53px;z-index:1"src="empty.png"></div>
			<div style="float:left;width:50px"><img src="blue_orb.png"><img id="blue" onclick=selectColor("b") style="position:relative; top:-53px;z-index:1"src="empty.png"></div>
			<div style="float:left;width:50px"><img src="green_orb.png"><img id="green" onclick=selectColor("g") style="position:relative; top:-53px;z-index:1"src="empty.png"></div>
			<div style="float:left;width:50px"><img src="dark_orb.png"><img id="dark" onclick=selectColor("d") style="position:relative; top:-53px;z-index:1"src="empty.png"></div>
			<div style="float:left;width:50px"><img src="light_orb.png"><img id="light" onclick=selectColor("l") style="position:relative; top:-53px;z-index:1"src="empty.png"></div>
			<div style="float:left;width:50px"><img src="heart_orb.png"><img id="heart" onclick=selectColor("h") style="position:relative; top:-53px;z-index:1"src="empty.png"></div>
			  
		</div>




*/

