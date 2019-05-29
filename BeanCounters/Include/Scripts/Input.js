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

// Handle keyboard input
if(!device.isSwitch) {
	$(window).keydown(function(e) {
		if(e.which == 37) {
			moving = 1
		}
		else if(e.which == 39) {
			moving = 2
		}
		else if(e.which == 32) {
			DropBag()
		}
	})
	$(window).keyup(function(e) {
		if(e.which == 37 || e.which == 39) {
			moving = 0
		}
	})
}