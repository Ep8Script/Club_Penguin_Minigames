// Handle input for the Switch gamepad
function handleInput() {
	// Simplify getting the inputs
	var h = input.getHeld()
	var p = input.getPressed()
	var r = input.getReleased()
	
	switch(app.currentState()) {
		case "Game":
			if(p == input.LStickLeft || p == input.DPadLeft) {
				moving = 1
			}
			else if(p == input.LStickRight || p == input.DPadRight) {
				moving = 2
			}
			else if(r == input.LStickLeft || r == input.DPadLeft || r == input.LStickRight || r == input.DPadRight) {
				moving = 0
			}
			else if(p == input.A) {
				DropBag()
			}
			break
		case "Menu":
			if(r == input.A) {
				Play()
			}
			break
		case "VR":
			if(p == input.A) {
				if($(".vr-setup").length) {
					var done = false
					$(".vr-setup").fadeOut("slow", function() {
						if(!done) {
							done = true
							$(".left-eye").html('<div class="how-to" style="display:none">Press <img class="vr-go" src="Assets/Start.png"> to exit VR Mode<br>at any time. <img class="ok" src="Assets/Start.png"></div>')
							$(".how-to").delay(200).fadeIn("fast")
							setTimeout(function() {
								$(".ok").fadeIn("slow", function() {
									$(this).addClass("flash")
								})
							}, 1300)
						}
					})
				}
				else if($(".ok.flash").length) {
					VRStart()
				}
			}
			break
	}
	
	if(p == input.B) {
		if(confirm("Return to the 4TU DNS?")) {
			location.href = "https://dns.switchbru.com"
		}
	}
	else if(p == input.Y) {
		if(confirm("Refresh the page?")) {
			location.reload()
		}
	}
}

// Allow mouse controls on PC
if(!device.isSwitch) {
	$("body").on("mousemove", ".play-area", function(e) {
		if(app.currentState() == "Game") {
			if(!dead && $(".truck.ready").length) {
				playerPos = e.pageX - 140 - $(".game").get(0).offsetLeft
				// Keep the player in the boundaries
				if(playerPos < 90) {
					// Reset them to left maximum
					playerPos = 90
				}
				else if(playerPos > 570) {
					// Reset to right maximum
					playerPos = 570
				}
			}
		}
	}).on("click", function() {
		if(app.currentState() == "Game") {
			DropBag()
		}
	})
}