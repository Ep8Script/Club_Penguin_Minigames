// Import other files
require("Include/Scripts/Game")
require("Include/Scripts/Input")
require("Include/Scripts/Maps")
require("Include/Scripts/Multiplayer")
require("Include/Scripts/Tiles")

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
	// Check if it's a mobile device on load
	if(testMobile()) {
		app.setState("Fail")
		$("body").toggleClass("loading sorry").html("Sorry :(")
		setTimeout(function() {
			alert("Unfortunately, this web app is not supported on mobile devices. Please try it out on a PC or laptop instead.")
		}, 100)
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
	var pre = [a+"Background.png",a+"Clouds.png",a+"FinishLine.png",a+"MapCorner.png",a+"Timer.png",a+"UserIcon.png",c+"1.gif",c+"2.gif",h+"20_A.png",h+"Finish.png",h+"Start.png",p+"back.png",p+"crashed.gif",p+"default.png",p+"left.png",p+"right.png",pl+"Other.png",pl+"Self.png",t+"default.png",t+"flipped.png",t+"left.png",t+"right.png",t+"shadow.png"]
	for (var i = 0; i < 20; i++) { 
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
		// Preload audio files
		var files = [a+"Music.mp3", a+"Finish.mp3"]
		$.each(files, function(i, file) {
			var audio = new Audio()
			audio.src = file
		})
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
	
	// Reset the zoom level
	$("body").css("zoom", innerWidth / outerWidth)
}, {allowCursor:true})