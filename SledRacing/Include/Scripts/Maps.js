var map = [], PlayerTiles = {}, TileMap = []
// Bunny Hill
map[0] = [2,3,0,8,0,14,0,14,0,4,1,3,5,0,4,0,16,16,4,0,13,4,3,0,5,0,3,4,14,13,0,4,8,9,7,9,7,0,3,1,0,11,3,4,8,1,11,3,16,16,1,3,5,10,0,4,3,18,0,16,0,0,17,0,4,12,0,3,0,4,17,3,2,11,0,8,3,17,13,0,3,1,3,8,10,0,4]
// Express
map[1] = [4,17,17,1,12,0,15,11,2,4,0,16,4,10,0,18,16,3,2,0,5,6,2,15,13,3,0,15,12,0,14,10,3,8,7,9,4,20,0,6,3,2,11,4,16,3,7,19,9,0,6,2,5,13,4,17,16,0,15,4,16,3,14,1,16,0,11,4,12,3,0,4,8,0,0,16,4,5,0,14,17,10,3,12,4,0]
// Penguin Run
map[2] = [0,7,9,3,13,2,16,8,1,3,6,0,0,11,0,18,0,4,16,3,12,0,14,10,0,8,11,0,4,3,2,20,0,16,0,14,0,11,0,7,7,9,9,12,0,5,4,17,14,4,0,0,0,16,0,14,19,11,4,11,0,17,5,19,1,16,11,6,0,13,3,2,17,11,8,0,4,5,16,0,6,8,0,19,3,0,0]
// Ridge Run
map[3] = [1,20,0,8,17,0,10,0,16,3,5,4,16,0,2,0,8,11,0,7,0,8,3,10,0,11,6,17,0,5,7,18,9,3,5,10,0,11,0,16,4,0,10,2,18,12,0,20,3,2,17,6,17,0,15,4,11,3,19,14,2,15,12,0,17,13,5,4,0,3,16,4,6,7,9,4,11,18,15,0,11,4,19,20,0]

// Load the selected map
function LoadMap() {
	if(typeof currentMap == "object" && currentMap.length > 1) {
		// Change the third tile
		var f = currentMap.shift()
		$(".tile").eq(2).removeClass("tile-0").addClass("tile-"+f).attr("src", "Assets/HillTiles/"+f+".png")
		// Add the finish line
		currentMap.push("Finish")
		// Clear the countdown timer
		clearInterval(startTimer)		
		
		var baseMap = Object.assign({}, currentMap), extra = 1, left = 734, top = 467, $t
		// Loop through the tiles
		$.each(baseMap, function(i,t) {
			if(t !== "Finish") {
				$(".tiles .tile").last().after('<img class="tile tile-'+t+'" src="Assets/HillTiles/'+t+'.png">')
				// Get the last tile
				$t = $(".tiles .tile").last()
				// Change the position
				left += 249
				top += 149
				$t.css({left:left,top:top})
				// Add an extra tile automatically for the hill
				if(t == 20) {
					$t.after('<img class="tile tile-20_a" src="Assets/HillTiles/20_A.png">')
					left += 249
					top += 149
					// Add the extra tile to the full map
					currentMap.splice(Number(i)+extra, 0, "20_a")
					extra++
					$t.next().css({left:left,top:top})
				}
			}
		})
		currentMap.unshift(0, f)
		// Add the finish line
		$t.after('<img class="tile tile-finish" src="Assets/HillTiles/Finish.png"><img class="finish-line" src="Assets/FinishLine.png"><img class="clapping-1" src="Assets/Clapping/1.gif"><img class="shadow-1" src="Assets/Tube/shadow.png"><img class="clapping-2" src="Assets/Clapping/2.gif"><img class="shadow-2" src="Assets/Tube/shadow.png">')
		$t.nextAll().css({left:left+249,top:top+149})
		// Prepare the special map of the tiles
		TileMap = []
		$.each(currentMap, function(i) {
			var $t = $(".tile:not(.tile-start)").eq(i)
			TileMap.push({l:parseFloat($t.css("left")),t:parseFloat($t.css("top"))})
		})
		PlayerTiles = {}
		// The map is ready
		StartGame()
	}
}

// Check the map's current tile
function checkMap($p) {
	var id = $p.attr("player")
	var pt = PlayerTiles[id]
	if(pt.currentIndex !== -1) {
		var l = Number($p.attr("left")||0)+35
		var t = Number($p.attr("top")||0)+35
		// If the current player is on a new tile
		if(TileMap[pt.currentIndex].l <= l && TileMap[pt.currentIndex].t <= t) {
			pt.checkedFirstPos = false
			pt.currentTile = currentMap[pt.currentIndex]
			pt.hillPos = TileMap[pt.currentIndex].t
			pt.tilePos = 0
			if(TileMap.length-1 > pt.currentIndex) {
				pt.currentIndex++
			}
			else {
				pt.currentIndex = -1
				
			}
		}
		
		// Check the collision with tile objects
		if(!pt.checkedFirstPos) {
			pt.checkedFirstPos = true
			checkCollision(id)
		}
		else if(t > pt.hillPos+16.5555556) {
			pt.hillPos += 16.5555556
			pt.tilePos++
			checkCollision(id)
		}
	}
}

// Check player collision
function checkCollision(id) {
	var $p = $(".player[player='"+id+"']")
	var pt = PlayerTiles[id]
	// Validate the current tile map
	if(typeof hillTile[pt.currentTile]=="object"&&typeof hillTile[pt.currentTile].map=="object"&&hillTile[pt.currentTile].map.length==9) {
		// Get the current tile collision map
		var t = hillTile[pt.currentTile].map[$p.attr("x")][pt.tilePos]
		if(t == 1 && $p.attr("me") && !$p.attr("crashed")) {
			// Separate if statement to avoid the player from going giant - JavaScript right?
			// If I put them together it has a major slowdown
			if(!$p.attr("jumping")) {
				// The player hit an obstacle
				$p.attr("crashed",true).attr("crash-state",1).css({"margin-left":15,"margin-top":15/XMultiplier}).find(".penguin").attr("src", "Assets/Penguin/right.png")
				$p.find(".tube").attr("src", "Assets/Tube/right.png")
				// Send the crash to the other players
				if(multiplayer) {
					server.emit("action", {type:"crash"})
				}
			}
		}
		else if(t == 2 && !$p.attr("jumping") && !$p.attr("crashed")) {
			// The player hit a bump
			playerJump($p,"small")
		}
		else if(t == 3 && !$p.attr("jumping") && !$p.attr("crashed")) {
			// The player hit a log jump
			playerJump($p,"medium")
		}
		else if(t == 4 && !$p.attr("jumping") && !$p.attr("crashed")) {
			// The player hit a hill
			playerJump($p,"large")
		}
		else if(t == 5 && !$p.attr("jumping") && !$p.attr("crashed")) {
			// The player hit a cliff
			playerJump($p,"mega")
		}
		else if(t == 99 && !$p.attr("crashed") && $p.attr("me")) {
			// The player touched ice
			$p.attr("speed", boostSpeed)
			// Send the boost to the other players
			if(multiplayer) {
				server.emit("action", {type:"boost"})
			}
		}
	}
}

// Make a player jump over an object
function playerJump(p,h) {
	p.addClass("jumping").attr("jumping",h).attr("jump-state",1)
}