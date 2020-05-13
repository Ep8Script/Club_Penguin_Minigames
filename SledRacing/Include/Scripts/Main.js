// Import other files
include("Include/Scripts/Game")
include("Include/Scripts/Input")
include("Include/Scripts/Maps")
include("Include/Scripts/Multiplayer")
include("Include/Scripts/Tiles")

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
	// Check for a mobile client
	if(testMobile()) {
		app.setState("Mobile")
		$("body").toggleClass("loading sorry").html("Sorry :(")
		setTimeout(function() {
			alert("Sorry, this game app is not supported on mobile devices. Please play on a PC or laptop instead.")
		}, 1)
		return
	}
	app.setState("Loading")
	var a = "Assets/"
	var c = a+"Clapping/"
	var h = a+"HillTiles/"
	var p = a+"Penguin/"
	var pl = a+"Players/"
	var t = a+"Tube/"
	// Preload all the assets
	var pre = [a+"Background.png",a+"Clouds.png",a+"Finish.mp3",a+"FinishLine.png",a+"MapCorner.png",a+"Music.mp3",a+"Timer.png",a+"UserIcon.png",c+"1.gif",c+"2.gif",h+"20_A.png",h+"Finish.png",h+"Start.png",p+"back.png",p+"crashed.gif",p+"default.png",p+"left.png",p+"right.png",pl+"Other.png",pl+"Self.png",t+"default.png",t+"flipped.png",t+"left.png",t+"right.png",t+"shadow.png"]
	for (var i = 0; i <= 20; i++) { 
		pre.push(h+i+".png")
	}
	preload(pre, function() {
		// Wait a little bit longer
		setTimeout(function() {
			// Check the server connection
			$(".loading-text").text("Checking Server Connection")
			$(".loading-bar").css("width","0%")
			// Check the test endpoint
			$.getJSON(Endpoints.PlatformURL+Endpoints.OnlineTest, function(test) {
				// Check if the server is online
				multiplayer = !!test.online
				Lobby()
			}).fail(function() {
				// The server is offline
				Lobby()
			})
		}, 400)
	}, function(percent) {
		$(".loading-bar").css("width",percent+"%")
	})
})


app.mainLoop(function() {
	if(app.currentState() == "Game") {
		$(".player").each(function() {
			movePlayer($(this))
			var $p = $(this).find(".penguin")
			// Stop the penguin from appearing giant
			if($p.hasClass("crashed")) {
				if($p.attr("src") !== "Assets/Penguin/crashed.gif") {
					$p.removeClass("crashed")
				}
			}
		})
	}
}, {allowCursor:true})