var dead = false, holding = 0, life = 3, moving = 0, playerPos = 360, stackHeight = 0, truck = 1, score = 0

function Play() {
	// Create the game arena
	app.setState("Game")
	$(".menu").addClass("game").removeClass("menu")
	$(".game-menu").addClass("background").removeClass("game-menu").attr("src", "Assets/Background.png")
	$(".start-button, .logo").remove()
	$(".background").after('<div class="alert" style="display:none">Truck Unloaded!!</div>')
	$(".alert").after('<img class="platform" src="Assets/Platform.png">')
	$(".platform").after('<div class="stack"></div>')
	$(".stack").after('<div class="player"><div class="hitbox"></div><img src="Assets/Player/0.png"></div>')
	$(".player").after('<div class="badluck" style="display:none">Try Again...</div>')
	$(".badluck").after('<div class="scoreboard">Lives: <span class="lives">3</span> Truck: <span class="truck-num">1</span> Score: <span class="score">0</span></div>')
	$(".scoreboard").after('<img class="truck ready" src="Assets/Truck.png">')

	// Add the stacked bags and position them
	var bottom = 5
	$.each([1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19,20], function() {
		$(".stack").append('<div class="bag hid" style="bottom:'+bottom+'px"><img src="Assets/Hazards/Bag_3.png"></div>')
		var b = $(".stack .bag").last()
		if(device.randomNum(1)) {
			b.css({left:device.randomNum(-3,1),transform:"scale(-1, 1)"})
		}
		else {
			b.css("left",device.randomNum(9,14)+"px")
		}
		b.find("img").css("transform", "rotate("+device.randomNum(13,15)+"deg)")
		bottom += 17
	})
	
	StartHazards()
}

app.mainLoop(function() {
	if(app.currentState() == "Game") {
		$(".player").css("left", playerPos+"px")
		if(!dead && $(".truck.ready").length) {
			// Update the player sprite and position
			$(".player img").attr("src", "Assets/Player/"+holding+".png")
			if(moving == 1) {
				// Moving left
				playerPos -= 8
			}
			else if(moving == 2) {
				// Moving right
				playerPos += 8
			}
			
			// Keep the player in the boundaries
			if(playerPos < 90) {
				// Reset them to left maximum
				playerPos = 90
			}
			else if(playerPos > 680) {
				// Reset to right maximum
				playerPos = 680
			}
			
			// Loop through each falling hazard / bag
			$(".hazard").each(function() {
				// Check if the player's hitbox is colliding
				if(collidesWith($(".hitbox")[0], this) && $(this).attr("fallin")) {
					// Remove the hazard
					$(this).remove()
					// Check which hazard it is
					switch($(this).attr("name")) {
						case "Bag":
							if(holding < 5) {
								// Add another bag to the player hand
								holding++
								// Add to the score
								score += 2
							}
							else {
								// The player is carrying too many bags and is dead
								Dead("Bag")
							}
							break
						case "Life":
							life++
							break
						default:
							Dead($(this).attr("name"))
					}
				}
			})
			
			// Display the current stack correctly
			if($(".stack .bag:not(.hid)").length !== stackHeight) {
				$(".stack .bag").each(function(i) {
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
		$(".lives").text(life)
		$(".truck-num").text(truck)
		$(".score").text(score)
		
	}
	handleInput()
})

function Dead(type) {
	dead = true
	$(".player img").attr("src", "Assets/Player/"+type+"_Dead.png")
	clearInterval(spawnInterval)
	// Check if any lives are left
	if(life) {
		$(".badluck").show()
		$(".alert").addClass("countdown").text(3).delay(100).fadeIn(200, function() {
			$(this).delay(600).fadeOut(200, function() {
				$(this).text(2).fadeIn(200, function() {
					$(this).delay(600).fadeOut(200, function() {
						$(this).text(1).fadeIn(200, function() {
							$(this).delay(600).fadeOut(200, function() {
								// Reset the screen
								$(this).hide().removeClass("countdown").text("Truck Unloaded!!")
								$(".badluck").hide()
								dead = false
								holding = 0
								playerPos = 360
								StartHazards()
							})
						})
					})
				})
			})
		})
		life--
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
	if(holding && playerPos < 135 && $(".truck.ready").length) {
		// Remove a bag from the hand
		holding -= 1
		// Add to the score
		score += 3
		// Add 1 to the stack
		stackHeight += 1
		// Check the stack size
		if(stackHeight == 20) {
			if(truck < 5) {
				// Display text
				$(".alert").show()
				// Stop the hazards
				clearInterval(spawnInterval)
				// Make the truck leave
				var truckLeave = function() {
					if(parseInt($(".truck").css("right")) <= -316) {
						// Hide the text and change it
						$(".alert").hide().text("Next Truck!!")
						// Make the truck come back
						setTimeout(truckLoad, 200)
					}
					else {
						$(".truck").removeClass("ready").css("right", "-=9")
						setTimeout(truckLeave, 40)
					}
				}
				setTimeout(truckLeave, 8)
				var truckLoad = function() {
					if(parseInt($(".truck").css("right")) >= -5) {
						// Hide the text again
						$(".alert").hide().text("Truck Unloaded!!")
						// Reset all the variables and start the next level
						holding = 0
						moving = 0
						playerPos = 360
						stackHeight = 0
						truck++
						$(".truck").addClass("ready")
						StartHazards()
					}
					else {
						// Show the text
						$(".alert").show()
						$(".truck").css("right", "+=9")
						setTimeout(truckLoad, 40)
					}
				}
			}
			else {
				alert("Congratulations! All the trucks have been unloaded! You achieved a score of "+score+"!")
				GameOver()
			}
		}
	}
}

// Game over (resetting all variables)
function GameOver() {
	dead = false
	holding = 0
	life = 3
	moving = 0
	playerPos = 360
	stackHeight = 0
	truck = 1
	score = 0
	MainMenu()
}