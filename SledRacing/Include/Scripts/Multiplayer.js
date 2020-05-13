include("Include/Scripts/Endpoints")
include("Include/Scripts/SocketIO")
var multiplayer = false, players = [], server = io(Endpoints.PlatformURL,{autoConnect:false,reconnection:false}), startTimer = setInterval

// The room is updated - start the countdown if necessary
function updateRoom(count) {
	$(".starting").remove()
	// Show the players in the room
	$(".waiting div").text("Waiting for Players... ("+players.length+"/4)")
	if(count) {
		// Do the countdown
		startTimer = setInterval(function() {
			// Show the current countdown number
			if($(".starting").length) {
				$(".starting").text(count)
			}
			else {
				$(".waiting").append('<div class="starting">'+count+'</div>')
			}
			count--
			if(count < 0) {
				LoadMap()
			}
		}, 1000)
		return
	}
	$(".waiting").append('<div class="starting"><span class="solo">Play Solo</span></div>')
}

// Connected to the server
server.once("connect", function() {
	if(app.currentState() == "Lobby") {
		// Get the main tags
		var tags = []
		$(".game *").each(function() {
			tags.push($(this).prop("tagName").toLowerCase())
		})
		// Verification
		server.emit("tag_verify", tags, username)
	}
})

// Disconnected from the server
server.once("disconnect", function() {
	switch(app.currentState()) {
		case "Lobby":
			// In the lobby, load a single player game
			multiplayer = false
			$(".server-status .online").toggleClass("offline online")
			Init()
			break
		case "Game":
			// Display error message (if they haven't finished)
			if(!$(".player[me]").attr("finished")) {
				maxSpeed = 0
				alert("You were disconnected from the server.")
			}
	}
})

// Game verified
server.once("confirmed", function() {
	$(".waiting div").text("Finding a Match...")
})

// A game was found / created
server.on("game_connected", (game) => {
	if(app.currentState() == "Lobby") {
		currentMap = Object.assign([],map[game.map])
		players = game.players
		clearInterval(startTimer)
	}
})
// A new player joined
server.on("new_player", (pl) => {
	if(app.currentState() == "Lobby") {
		players.push(pl)
		clearInterval(startTimer)
	}
})
// Update the room
server.on("update_room", updateRoom)
// Start race
server.on("start_race", StartRacing)
// Handle actions from other players in game
server.on("player_action", (id, action) => {
	var $p = $(".player[player='"+id+"']")||$(".player").last()
	switch(action.type) {
		case "turn":
			playerTurn(id, action.dir||"left")
			break
		case "crash":
			$p.attr("crashed",true).attr("crash-state",1).css({"margin-left":15,"margin-top":15/XMultiplier}).find(".penguin").attr("src", "Assets/Penguin/right.png")
			$p.find(".tube").attr("src", "Assets/Tube/right.png")
			break
		case "boost":
			$p.attr("speed", boostSpeed)
	}
})
// A player disconnected
server.on("player_disconnected", (id) => {
	switch(app.currentState()) {
		case "Lobby":
			players.splice(id,1)
			clearInterval(startTimer)
			break
		case "Game":
			$(".player[player='"+parseInt(id+1)+"']").addClass("disconnected")
	}
})