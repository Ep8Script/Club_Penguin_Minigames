// Import other files
include("Include/Scripts/Hazard")
include("Include/Scripts/Input")
include("Include/Scripts/Play")
include("Include/Scripts/VR")

// Preload assets with optional callback, and percentage callback
function preload(a, c, pc) {
	var count = a.length
	var loaded = 0
	var assetLoaded = function() {
		loaded++
		if(loaded == count && typeof c == "function") {
			c()
			$(".audioPreloaded").remove()
		}
		if(typeof pc == "function") {
			var percent = (loaded / count) * 100
			pc(percent)
		}
	}
	$.each(a, function(i, f) {
		if(f.endsWith(".mp3")) {
			var audio = new Audio()
			audio.src = f
			audio.addEventListener("canplaythrough", assetLoaded, false)
			audio.addEventListener("error", assetLoaded, false)
			$("body").append('<audio class="audioPreloaded" muted="muted" preload="auto" src="'+f+'"></audio>')
		}
		else {
			$("<img>").attr("src", f).on("load error", assetLoaded)
		}
	})
}

app.onLoad(function() {
	app.setState("Loading")
	var a = "Assets/"
	var h = a+"Hazards/"
	var p = a+"Player/"
	var s = a+"Sounds/"
	var v = a+"VR/"
	// Preload all the assets
	preload([a+"Background.png",a+"Button.png",a+"Game.png",a+"Main.png",a+"Platform.png",a+"Shop.png",a+"Start.png",a+"Truck.png",h+"Anvil.png",h+"Anvil_Broken.png",h+"Bag_1.png",h+"Bag_2.png",h+"Bag_3.png",h+"Bag_Broken.png",h+"Fish.png",h+"Fish_Broken.png",h+"Life.png",h+"Vase.png",h+"Vase_Broken.png",p+"0.png",p+"1.png",p+"2.png",p+"3.png",p+"4.png",p+"5.png",p+"Anvil_Dead.png",p+"Bag_Dead.png",p+"Fish_Dead.png",p+"Vase_Dead.png",s+"Anvil_Land.mp3",s+"Bag_Land.mp3",s+"Catch.mp3",s+"Fish_Land.mp3",s+"Hit.mp3",s+"Life.mp3",s+"Music.mp3",s+"Place.mp3",s+"Truck.mp3",s+"TruckReverse.mp3",s+"Vase_Land.mp3",v+"LaboVR.png"], function() {
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
	$("body").addClass("in-game").removeClass("loading").find(".game").html('<div class="menu"><img class="game-menu" src="Assets/Main.png"><div class="start-button">'+(device.isSwitch?'<img class="start" src="Assets/Start.png">':"")+'<span'+(!device.isSwitch?' style="left:2px"':"")+'>Play</span><img class="button" src="Assets/Button.png"></div><div class="vr-start"><span>VR Mode</span><img class="button" src="Assets/Button.png"></div><img class="logo" src="Assets/Game.png"></div>')
	$(".start-button").click(Play)
	$(".vr-start").on("click", PlayVR).on("touchend", function() {
		// Enter fullscreen
		$("html").get(0).webkitRequestFullscreen()
	})
	// Play the music
	if(!device.isSwitch) {
		$(".bgm").remove()
		$("body").append('<audio autoplay class="bgm" loop src="Assets/Sounds/Music.mp3"></audio>')
	}
}