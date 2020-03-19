var dead = false, holding = 0, life = 3, moving = 0, stackHeight = 0, truck = 1, score = 0

// Normal play
function Play() {
	// Create the game arena
	playerPos = 360
	app.setState("Game")
	$(".menu").toggleClass("play-area menu")
	$(".game-menu").addClass("background").removeClass("game-menu").attr("src", "Assets/Background.png")
	$(".start-button, .vr-start, .logo").remove()
	$(".background").after('<div class="alert" style="display:none">Truck Unloaded!!</div>')
	$(".alert").after('<img class="platform" src="Assets/Platform.png">')
	$(".platform").after('<div class="stack"></div>')
	$(".stack").after('<div class="player" style="left: 360px;"><div class="hitbox"></div><img src="Assets/Player/0.png"></div>')
	$(".player").after('<div class="badluck" style="display:none">Try Again...</div>')
	$(".badluck").after('<div class="scoreboard">Lives: <span class="lives">3</span> Truck: <span class="truck-num">1</span> Score: <span class="score">0</span></div>')
	$(".scoreboard").after('<img class="truck ready" src="Assets/Truck.png">')
	addBags()
	StartHazards()
}

function addBags() {
	// Add the stacked bags and position them
	var bottom = 5
	for(var i = 0; i < 20; i++) {
		$(".stack").first().append('<div class="bag hid" style="bottom:'+bottom+'px"><img src="Assets/Hazards/Bag_3.png"></div>')
		var b = $(".stack").first().find(".bag").last()
		if(device.randomNum(1)) {
			b.css({left:device.randomNum(-3,1),transform:"scale(-1, 1)"})
		}
		else {
			b.css("left",device.randomNum(9,14))
		}
		b.find("img").css("transform", "rotate("+device.randomNum(13,15)+"deg)")
		bottom += isVR?11:17
	}
}

app.mainLoop(function() {
	if(app.currentState() == "Game") {
		$(".player").first().css("left", playerPos+"px")
		if(!dead && $(".truck.ready").length) {
			// Update the player sprite and position
			$(".player img").first().attr("src", "Assets/Player/"+holding+".png")
			if(moving == 1) {
				// Moving left
				playerPos -= 16
			}
			else if(moving == 2) {
				// Moving right
				playerPos += 16
			}
			
			// Keep the player in the boundaries
			if(playerPos < (isVR?27:90)) {
				// Reset them to left maximum
				playerPos = isVR?27:90
			}
			else if(playerPos > (isVR?360:680)) {
				// Reset to right maximum
				playerPos = isVR?360:680
			}
			
			// Loop through each falling hazard / bag
			$(".play-area").first().find(".hazard").each(function() {
				// Check if the player's hitbox is colliding
				if(collidesWith($(".hitbox").first()[0], this) && $(this).attr("fallin")) {
					// Remove the hazard
					$(this).attr("gone",1).remove()
					// Check which hazard it is
					switch($(this).attr("name")) {
						case "Bag":
							if(holding < 5) {
								// Add another bag to the player hand
								holding++
								// Add to the score
								score += 2
								// Play the catch sound
								$(".catch").remove()
								$("body").append('<audio autoplay class="catch" src="Assets/Sounds/Catch.mp3"></audio>')
							}
							else {
								// The player is carrying too many bags and is dead
								Dead("Bag")
							}
							break
						case "Life":
							life++
							// Play the 1-Up sound
							$(".life").remove()
							$("body").append('<audio autoplay class="life" src="Assets/Sounds/Life.mp3"></audio>')
							break
						default:
							Dead($(this).attr("name"))
					}
				}
			})
			
			// Display the current stack correctly
			if($(".play-area").first().find(".stack .bag:not(.hid)").length !== stackHeight) {
				$(".stack").first().find(".bag").each(function(i) {
					if(i+1 <= stackHeight) {
						$(this).removeClass("hid")
					}
					else {
						$(this).addClass("hid")
					}
				})
			}
		}
		// Update the scoreboard
		$(".lives").first().text(life)
		$(".truck-num").first().text(truck)
		$(".score").first().text(score)
		
	}
	handleInput()
}, {fps:25})

function Dead(type) {
	dead = true
	$(".player img").first().attr("src", "Assets/Player/"+type+"_Dead.png")
	clearInterval(spawnInterval)
	// Check if any lives are left
	if(life) {
		$(".badluck").first().show()
		$(".alert").first().addClass("countdown").text(3).delay(100).fadeIn(200, function() {
			$(this).delay(600).fadeOut(200, function() {
				$(this).text(2).fadeIn(200, function() {
					$(this).delay(600).fadeOut(200, function() {
						$(this).text(1).fadeIn(200, function() {
							$(this).delay(600).fadeOut(200, function() {
								// Reset the screen
								$(this).hide().removeClass("countdown").text("Truck Unloaded!!")
								$(".badluck").first().hide()
								dead = false
								holding = 0
								StartHazards()
							})
						})
					})
				})
			})
		})
		life--
		// Play the hit sound
		$(".hit").remove()
		var s = type+"_Land"
		if(type == "Bag") {
			s = "Hit"
		}
		$("body").append('<audio autoplay class="hit" src="Assets/Sounds/'+s+'.mp3"></audio>')
	}
	else {
		setTimeout(function() {
			alert("Game Over!")
			GameOver()
		}, 50)
	}
}

// Discaring a bag onto the platform
function DropBag() {
	if(holding && playerPos < (isVR?46:135) && $(".truck.ready").length && stackHeight < 20) {
		// Remove a bag from the hand
		holding -= 1
		// Add to the score
		score += 3
		// Add 1 to the stack
		stackHeight += 1
		// Play the place sound
		$(".place").remove()
		$("body").append('<audio autoplay class="place" src="Assets/Sounds/Place.mp3"></audio>')
		// Check the stack size
		if(stackHeight == 20) {
			setTimeout(function() {
				if(truck < 5) {
					// Display text
					$(".alert").first().show()
					// Stop the hazards
					clearInterval(spawnInterval)
					// Play the truck sound
					$(".truck-sound").remove()
					$("body").append('<audio autoplay class="truck-sound" src="Assets/Sounds/Truck.mp3"></audio>')
					// Make the truck leave
					var truckLeave = function() {
						if(parseInt($(".truck").first().css("right")) <= -316) {
							// Hide the text and change it
							$(".alert").first().hide().text("Next Truck!!")
							// Play the reverse sound
							$("body").append('<audio autoplay class="truck-sound" src="Assets/Sounds/TruckReverse.mp3"></audio>')
							// Make the truck come back
							setTimeout(truckLoad, 200)
						}
						else {
							$(".truck").first().removeClass("ready").css("right", "-=9")
							setTimeout(truckLeave, 40)
						}
					}
					setTimeout(truckLeave, 8)
					var truckLoad = function() {
						if(parseInt($(".truck").first().css("right")) >= -5) {
							// Hide the text again
							$(".alert").first().hide().text("Truck Unloaded!!")
							// Reset all the variables and start the next level
							holding = 0
							moving = 0
							playerPos = isVR?200:360
							stackHeight = 0
							truck++
							$(".truck").first().addClass("ready")
							StartHazards()
						}
						else {
							// Show the text
							$(".alert").first().show()
							$(".truck").first().css("right", "+=9")
							setTimeout(truckLoad, 40)
						}
					}
				}
				else {
					alert("Congratulations! All the trucks have been unloaded! You achieved a score of "+score+"!")
					GameOver()
				}
			}, 80)
		}
	}
}

// Game over (resetting all variables)
function GameOver() {
	dead = false
	holding = 0
	life = 3
	moving = 0
	stackHeight = 0
	truck = 1
	score = 0
	MainMenu()
}