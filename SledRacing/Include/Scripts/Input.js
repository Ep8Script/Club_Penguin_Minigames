// Handle key inputs
$(window).keydown(function(e) {
	if(e.which == 37 || e.which == 40) {
		playerTurn(me,"left")
	}
	else if(e.which == 38 || e.which == 39) {
		playerTurn(me,"right")
	}
})

// Handle button clicks
$("body").on("click", ".play-again", function() {
	parent.location.reload()
}).on("click", ".solo", function() {
	multiplayer = false
	Init()
	server.emit("solo_game")
})

function promptUsername(def) {
	// Prompt for a username
	var name = prompt("Enter a username.", def||getCookie("name")||"")
	if(name !== null && name.length) {
		// If the username is too short
		if(name.length >= 20) {
			alert("Your username should contain more than 20 characters.")
			promptUsername(name)
			return
		}
		// Check the username for profanity
		checkUsername("containsprofanity", name, function(c) {
			if(c === "false") {
				// It's clear, continue
				username = $("<p></p>").text(name).html()
				setCookie("name", name, 200)
				Init()
			}
			else {
				alert("The username you entered is not allowed.")
				promptUsername()
			}
		})
		return
	}
	Init()
}

function checkUsername(type, string, cb) {
	if((type == "containsprofanity" || type == "json") && typeof string == "string" && typeof cb == "function") {
		$.get("https://www.purgomalum.com/service/"+type+"?text="+encodeURIComponent(string), function(d) {
			cb(d)
		})
	}
}

// Set cookies
function setCookie(name, val, exdays) {
	var d = new Date()
	d.setTime(d.getTime()+(exdays*24*60*60*1000))
	document.cookie = name+"="+val+";"+"expires="+d.toUTCString()+";path=/"
}
// Get cookies
function getCookie(c) {
	var name = c+"="
	var decodedCookie = decodeURIComponent(document.cookie)
	var ca = decodedCookie.split(';')
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
		  c = c.substring(1)
		}
		if (c.indexOf(name) == 0) {
		  return c.substring(name.length, c.length)
		}
	}
	return ""
}