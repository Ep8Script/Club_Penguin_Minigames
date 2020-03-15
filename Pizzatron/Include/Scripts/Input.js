// Handle button clicks
$("body").on("click", ".candy-trigger", function() {
	alert("Sorry, the Candytron 3000 is not available at this time.")
}).on("click", ".start-button", function() {
	StartGame()
}).on("click", ".end-button", function() {
	location.reload()
}).on("mousedown", ".ingredient-trigger", function(e) {
	if(e.which == 1) {
		var $i = $(this)
		// Check that it's a valid ingredient and get it
		Object.keys(ingredients).forEach(function(i) {
			if($i.hasClass(i.toLowerCase())) {
				GetIngredient(i,e)
				return
			}
		})
	}
}).on("mousedown", ".bottle-trigger", function(e) {
	var $b = $(this)
	// Get the bottle
	bottles.forEach(function(b) {
		if($b.hasClass(b.toLowerCase())) {
			UseBottle(b,e)
		}
	})
}).on("mousemove", function(e) {
	// If there's an object being held
	var $b = $(".bottle-holding:not(.dropped)"), $i = $(".ingredient-holding:not(.dropped)"), $s = $(".bottle-squeezing")
	var l = e.pageX-offsetX, t = e.pageY-offsetY
	if($b.length) {
		$b.css("left",l-offsetB).css("top",t-offsetB)
		if($s.length) {
			$s.css("left",l-offsetB+64.5).css("top",t-offsetB+217)
		}
	}
	else if($i.length) {
		$i.css("left",l).css("top",t)
	}
	mousePos = e
}).on("mouseup mouseleave", function(e) {
	// If there's an object being held
	var $b = $(".bottle-holding:not(.dropped)")
	var $i = $(".ingredient-holding:not(.dropped)")
	if($b.length) {
		DropBottle($b)
	}
	else if($i.length) {
		DropIngredient($i,e)
	}
})

// Toggle hitbox visibility (used for debugging)
$(window).keydown(function(e) {
	if(e.ctrlKey && e.which == 89) {
		$(".game").toggleClass("show-hitboxes")
		setCookie("showHitboxes", 1-(getCookie("showHitboxes")||1),365)
	}
})

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