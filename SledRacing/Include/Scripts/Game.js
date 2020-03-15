var boostSpeed = 16, currentMap, crashDecay = 0.95, decay = 0.98, gravity = 0.5, icon = "Assets/UserIcon.png", maxSpeed = 5, me = 1, startTime = 0, username = "Guest", XMultiplier = 249/149

function Lobby() {
	var p = 0
	// Show the loading bar 
	var lobbyLoad = setInterval(function() {
		p++
		$(".loading-bar").css("width",p+"%")
		if(p == 100) {
			clearInterval(lobbyLoad)
			
			// Create the game arena
			app.setState("Lobby")
			$(".loading").addClass("in-game").removeClass("loading")
			$(".game").html('<div class="victory-screen"><span class="header">Leaderboard</span><span class="placement first">1st <span class="player-name"><span class="name"></span> — <img class="timer" src="Assets/Timer.png"><span class="time"></span></span></span><span class="placement second">2nd <span class="player-name"><span class="name"></span> — <img class="timer" src="Assets/Timer.png"><span class="time"></span></span></span><span class="placement third">3rd <span class="player-name"><span class="name"></span> — <img class="timer" src="Assets/Timer.png"><span class="time"></span></span></span><span class="placement fourth">4th <span class="player-name"><span class="name"></span> — <img class="timer" src="Assets/Timer.png"><span class="time"></span></span></span><div class="play-again">Play Again</div></div><div class="background"></div><img class="clouds" src="Assets/Clouds.png" style="left:255px"><img class="corner" src="Assets/MapCorner.png"><div class="map"><div class="map-bar"></div></div><div class="tiles"><img class="tile tile-start" src="Assets/HillTiles/Start.png"><img class="tile tile-0" src="Assets/HillTiles/0.png" style="left:485px;top:318px"><img class="tile tile-0" src="Assets/HillTiles/0.png" style="left:734px;top:467px"></div><div class="waiting"><div>Waiting for Client...</div><img src="Assets/Loading.gif"></div><div class="server-status">Server Status: <span class="o'+(multiplayer?"n":"ff")+'line"></span></div>')
			
			// Delay slightly and prompt for a username
			setTimeout(promptUsername, 200)
		}
	},12)
}

// Initialise the game
function Init() {
	if(app.currentState() == "Lobby") {
		if(multiplayer) {
			// Playing with other people - connect to the server
			server.connect()
		}
		else {
			// Playing in single player only
			players = [{icon:icon,me:true,username:username}]
			// Pick the map
			currentMap = Object.assign([],map[device.randomNum(0,map.length-1)])
			LoadMap()
		}
	}
}

// Start the game
function StartGame() {
	// Add a slight delay
	setTimeout(function() {
		var lastX = 1
		var left = 424
		var top = 161
		// Add each player
		$.each(players, function(i,p) {
			// Shouldn't be more than 4 players
			if(i > 3) {
				return false
			}
			// Clean the username in a stupid way
			p.username = $("<p></p>").text(p.username).html()
			$(".tiles").append('<div class="player" player="'+Number(i+1)+'" finish-decay="'+(device.randomNum(910,935)/1000)+'" speed="0.5"><div class="name-tag">'+p.username+'</div><img class="penguin" src="Assets/Penguin/default.png"><img class="tube" src="Assets/Tube/default.png"></div>')
			var $p = $(".player").last()
			// Put them in position
			$p.attr("x", lastX).css({left:left+"px",top:top+"px"})
			// If this player is the current player
			if(p.me) {
				$p.attr("me",true)
				me = i+1
				var currX = lastX
				var LC = left
				var TC = top
				while(currX > 0) {
					currX--
					LC += 24
					TC -= 24/1.5
				}
				$p.attr("left", LC).attr("top", TC)
				// Bolden the player's own name if it matches another
				if(players.some(pl => (pl.username == username && !pl.me))) {
					$p.find(".name-tag").css("font-weight", "bold")
				}
			}
			lastX += 2
			left -= 48
			top += 32
			// Add the player icon to the map
			$(".map").append('<div class="map-placement'+(p.me?" me":"")+'" player="'+Number(i+1)+'" style="width:1.7%"><img src="Assets/Players/'+(p.me?"Self":"Other")+'.png"></div>')
			// Add the current tile info
			PlayerTiles[(i+1)] = {currentTile:"start",currentIndex:0,hillPos:0,tilePos:0}
		})
		// Start the countdown
		$(".waiting").remove()
		$(".game").append('<div class="countdown">READY</div>')
		// Start the music
		$("body").append('<audio autoplay class="music" loop src="Assets/Music.mp3">')
		setTimeout(function() {
			$(".countdown").remove()
			$(".game").append('<div class="countdown">SET</div>')
			setTimeout(function() {
				$(".countdown").remove()
				$(".game").append('<div class="countdown go">GO!</div>')
				setTimeout(function() {
					// Remove the countdown
					$(".countdown").fadeOut("fast", function() {$(this).remove()})
					if(!multiplayer) {
						StartRacing()
					}
				}, 600)
			}, 600)
		}, 600)
	}, 500)
}

function StartRacing() {
	startTime = Date.now()
	app.setState("Game")
}

// Move the camera down the hill
function moveCamera(dist) {
	// Update foreground tiles
	$(".tiles").css({left:"-="+(dist*XMultiplier),top:"-="+dist})
	
	// Update background clouds
	var bgX = Number($(".clouds").css("left").replace("px",""))
	bgX -= dist / 15
	$(".clouds").css("left", bgX+"px")
}

function movePlayer($p) {
	var speed = parseFloat($p.attr("speed")||"1")
	// If the player has reached the finish line
	if($p.attr("left") >= TileMap[TileMap.length-1].l+245) {
		speed *= $p.attr("finish-decay") || 0.91
		if(!$p.attr("finished")) {
			$p.attr("finished", Date.now())
			if($p.attr("me")) {
				Finished()
			}
			else if($(".player[me]").attr("finished")) {
				CheckTimes()
			}
		}
	}
	else if($p.attr("crashed") && $p.attr("crash-state")) {
		speed *= crashDecay
		
		// Animate the crash
		switch($p.attr("crash-state")) {
			case "3":
				$p.find(".penguin").attr("src", "Assets/Penguin/crashed.gif").addClass("crashed")
				$p.find(".tube").attr("src", "Assets/Tube/flipped.png")
				break
			case "5":
				$p.find(".tube").after('<img class="jump-shadow crash" src="Assets/Tube/shadow.png">')
				break
			case "52":
				$p.css({"margin-left":"","margin-top":""}).find(".penguin").attr("src", "Assets/Penguin/default.png").removeClass("crashed")
				$p.find(".tube").attr("src", "Assets/Tube/default.png").removeAttr("style")
				$p.find(".jump-shadow").remove()
				$p.removeAttr("crashed crash-state")
		}
		if($p.attr("crash-state")) {
			$p.attr("crash-state", Number($p.attr("crash-state"))+1)
			if($p.attr("crash-state") > 8) {
				$p.find(".tube").css({left:-42,top:-12})
			}
		}
	}
	else if(speed < maxSpeed) {
		speed = speed + gravity
		if(speed > maxSpeed) {
			speed = maxSpeed
		}
	}
	else if(speed > maxSpeed) {
		speed = speed * decay
		if(speed < maxSpeed) {
			speed = maxSpeed
		}
	}
	else {
		speed = maxSpeed
	}
	if(speed < 0.4) {
		speed = 0
	}
	$p.attr("speed", speed)
	
	// Update players position
	var pc = (($p.attr("left")||0) / TileMap[TileMap.length-1].l) * 100
	// This shouldn't be necessary, but it corrects disrepancy between the players and the background
	if(speed >= maxSpeed / 2 && pc > 42) {
		speed += .0166*speed
	}
	var playerY = parseFloat($p.css("top"))+speed
	$p.css({left:"+="+(speed*XMultiplier),top:playerY})
	
	// Update the map position
	if (pc < 0) {
		pc = 0
	}
	else if(pc > 100) {
		pc = 100
	}
	$(".map-placement[player='"+$p.attr("player")+"']").css("width", pc+"%")
	
	// Update the absolute position
	var currX = Number($p.attr("x")||2)
	var LC = parseFloat($p.css("left")||0)
	var TC = parseFloat($p.css("top")||0)
	while(currX > 0) {
		currX--
		LC += 24
		TC -= 24/1.5
	}
	$p.attr("left", LC).attr("top", TC)
	
	// Check map objects
	checkMap($p)
	
	// Current player
	if($p.attr("me")) {
		moveCamera(speed)
	}
	
	// Animate player jumping
	if($p.attr("jumping")) {
		// Check the jumping size and positions
		switch($p.attr("jumping")) {
			case "small":
				switch($p.attr("jump-state")) {
					case "4":
						$p.find(".penguin").attr("src", "Assets/Penguin/back.png")
						$p.find(".tube").after('<img class="jump-shadow small" src="Assets/Tube/shadow.png">')
						break
					case "10":
						$p.removeClass("jumping")
						break
					case "12":
						$p.find(".penguin").attr("src", "Assets/Penguin/default.png")
						$p.find(".jump-shadow").remove()
						break
					case "14":
						$p.removeAttr("jumping jump-state")
				}
				break
			case "medium":
				switch($p.attr("jump-state")) {
					case "5":
						$p.find(".penguin").attr("src", "Assets/Penguin/back.png")
						$p.find(".tube").after('<img class="jump-shadow medium" src="Assets/Tube/shadow.png">')
						break
					case "12":
						$p.removeClass("jumping")
						break
					case "14":
						$p.find(".penguin").attr("src", "Assets/Penguin/default.png")
						$p.find(".jump-shadow").remove()
						break
					case "17":
						$p.removeAttr("jumping jump-state")
				}
				break
			case "large":
				switch($p.attr("jump-state")) {
					case "3":
						$p.css("margin-top",-14)
						break
					case "6":
						$p.css("margin-top",-28)
						break
					case "9":
						$p.css("margin-top",-42)
						break
					case "12":
						$p.css("margin-top",-56)
						break
					case "14":
						$p.find(".penguin").attr("src", "Assets/Penguin/back.png")
						$p.find(".tube").after('<img class="jump-shadow large" src="Assets/Tube/shadow.png">')
						break
					case "16":
						$p.css("margin-top",-40)
						$p.find(".jump-shadow").css("margin-top",40)
						break
					case "19":
						$p.css("margin-top",-20)
						$p.find(".jump-shadow").css("margin-top",20)
						break
					case "21":
						$p.css("margin-top",-10)
						$p.find(".jump-shadow").css("margin-top",10)
						break
					case "23":
						$p.css("margin-top","")
						$p.find(".jump-shadow").remove()
						break
					case "25":
						$p.find(".penguin").attr("src", "Assets/Penguin/default.png")
						break
					case "26":
						$p.removeAttr("jumping jump-state")
				}
				break
			case "mega":
				switch($p.attr("jump-state")) {
					case "3":
						$p.css("margin-top",-15)
						break
					case "6":
						$p.css("margin-top",-30)
						break
					case "9":
						$p.css("margin-top",-45)
						break
					case "12":
						$p.css("margin-top",-60)
						break
					case "15":
						$p.css("margin-top",-75)
						break
					case "18":
						$p.css("margin-top",-90)
						break
					case "21":
						$p.css("margin-top",-105)
						break
					case "24":
						$p.css("margin-top",-120)
						break
					case "27":
						$p.css("margin-top",-135)
						break
					case "29":
						$p.find(".penguin").attr("src", "Assets/Penguin/back.png")
						$p.find(".tube").after('<img class="jump-shadow mega" src="Assets/Tube/shadow.png">')
						break
					case "31":
						$p.css("margin-top",-145)
						$p.find(".jump-shadow").css("margin-top",145)
						break
					case "33":
						$p.css("margin-top",-125)
						$p.find(".jump-shadow").css("margin-top",125)
						break
					case "35":
						$p.css("margin-top",-105)
						$p.find(".jump-shadow").css("margin-top",105)
						break
					case "37":
						$p.css("margin-top",-85)
						$p.find(".jump-shadow").css("margin-top",85)
						break
					case "39":
						$p.css("margin-top",-65)
						$p.find(".jump-shadow").css("margin-top",65)
						break
					case "41":
						$p.css("margin-top",-45)
						$p.find(".jump-shadow").css("margin-top",45)
						break
					case "43":
						$p.css("margin-top",-25)
						$p.find(".jump-shadow").css("margin-top",25)
						break
					case "45":
						$p.css("margin-top",-5)
						$p.find(".jump-shadow").css("margin-top",5)
						break
					case "47":
						$p.css("margin-top","")
						break
					case "48":
						$p.find(".penguin").attr("src", "Assets/Penguin/default.png")
						$p.find(".jump-shadow").remove()
						break
					case "50":
						$p.removeAttr("jumping jump-state")
				}
		}
	}
	// Increment the state for different animations
	if($p.attr("jump-state")) {
		$p.attr("jump-state", Number($p.attr("jump-state"))+1)
	}
}

function playerTurn(player, dir) {
	var $p = $(".player[player='"+player+"']")
	if(typeof dir !== "string" || dir != "left" && dir != "right") {
		dir = "left"
	}
	// If the player's allowed to move
	if(app.currentState() == "Game" && !$p.attr("jumping") && !$p.attr("crashed") && $p.attr("left") < TileMap[TileMap.length-1].l) {
		// Get the movement amount
		var XC = dir=="left"?1:-1
		var x = parseInt($p.attr("x")||1)+XC
		// If the player is in range
		if(x <= 8 && x >= 0) {
			// Change the images to turning
			$p.find(".penguin").attr("src", "Assets/Penguin/"+dir+".png")
			$p.find(".tube").attr("src", "Assets/Tube/"+dir+".png")
			$p.attr("x", x)
			
			// Wait a short time then move the player
			setTimeout(function() {
				$p.css({left:(dir=="left"?"-":"+")+"="+24,top:(dir=="left"?"+":"-")+"="+24/1.5})
				setTimeout(function() {
					// Reset the penguin animation
					$p.find(".penguin").attr("src", "Assets/Penguin/default.png")
					$p.find(".tube").attr("src", "Assets/Tube/default.png")
				}, 23)
			}, 23)
			// Tell the other players they're turning
			if($p.attr("me") && multiplayer) {
				server.emit("action", {type:"turn",dir:dir})
			}
		}
	}
}

// After hitting the finish line
var placement = 0
function Finished() {
	if($(".music").length && !$(".finish-sound").length) {
		$(".music").toggleClass("music finish-sound").removeAttr("loop").attr("src", "Assets/Finish.mp3")
		$(".finish-sound").get(0).volume = 0.35
	}
	setTimeout(function() {
		$(".victory-screen").show()
		CheckTimes()
	}, 500)
}

function CheckTimes() {
	var wait = 200
	var finishedTimes = []
	$(".player[finished]:not([checked])").each(function() {
		finishedTimes.push(parseInt($(this).attr("finished")))
		$(this).attr("checked",true)
	})
	finishedTimes.sort()
	$.each(finishedTimes, function(i,t) {
		var $pl = $(".placement").eq(placement)
		$pl.find(".name").text($(".player[finished='"+t+"']").find(".name-tag").html())
		var diff = t - startTime
		var mins = ("00"+Math.floor(diff/60000)).slice(-2)
		var secs = Math.floor((diff-(parseInt(mins)*60000))/1000)
		var ms = diff - (parseInt(secs)*1000)
		$pl.find(".time").text(mins+":"+secs+":"+ms)
		placement++
		setTimeout(function() {
			$pl.fadeIn("slow")
			wait += 200
		}, wait)
	})
}

// Check if the client is a mobile device
function testMobile() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))||getCookie("wasMobile")) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	// Set the cookie if not already set
	if(check && !getCookie("wasMobile")) {
		setCookie("wasMobile", 1, 1)
	}
	return check;
}