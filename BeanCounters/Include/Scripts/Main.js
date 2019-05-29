// Import other files
require("Include/Scripts/Hazard")
require("Include/Scripts/Input")
require("Include/Scripts/Play")

// Preload images with optional callback, and percentage callback
function preload(a, c, pc) {
	var count = a.length
	var loaded = 0
	$.each(a, function(index, i) {
		$('<img>').attr('src', i).on('load error', function(e) {
			loaded++
			if(loaded == count && typeof c == "function") {
				c()
			}
			if(typeof pc == "function") {
				var percent = (loaded / count) * 100
				pc(percent)
			}
		})
	})
}

app.onLoad(function() {
	app.setState("Loading")
	var a = "Assets/"
	var h = a+"Hazards/"
	var p = a+"Player/"
	// Preload all the assets
	preload([a+"Background.png",a+"Button.png",a+"Game.png",a+"Main.png",a+"Platform.png",a+"Start.png",a+"Truck.png",h+"Anvil.png",h+"Anvil_Broken.png",h+"Bag_1.png",h+"Bag_2.png",h+"Bag_3.png",h+"Bag_Broken.png",h+"Fish.png",h+"Fish_Broken.png",h+"Life.png",h+"Vase.png",h+"Vase_Broken.png",p+"0.png",p+"1.png",p+"2.png",p+"3.png",p+"4.png",p+"5.png",p+"Anvil_Dead.png",p+"Bag_Dead.png",p+"Fish_Dead.png",p+"Vase_Dead.png"], function() {
		// Wait a little bit longer and load the game
		setTimeout(function() {
			// Show the main menu
			MainMenu()
		}, 400)
	}, function(percent) {
		$(".loading-bar").css("width",percent+"%")
	})
})

// Show the main menu
function MainMenu() {
	app.setState("Menu")
	$("body").addClass("in-game").removeClass("loading").html('<div class="menu"><img class="game-menu" src="Assets/Main.png"><div class="start-button" onclick="Play()"><img class="start" src="Assets/Start.png"><span>Play</span><img class="button" src="Assets/Button.png"></div><img class="logo" src="Assets/Game.png"></div>')
}

// Show the hitbox
function ShowHitbox() {
	$(".hitbox").addClass("visible")
}