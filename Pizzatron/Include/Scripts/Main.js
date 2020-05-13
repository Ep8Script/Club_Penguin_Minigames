// Import other files
include("Include/Scripts/Game")
include("Include/Scripts/Input")
include("Include/Scripts/Orders")

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
	var b = a+"Bottles/"
	var e = a+"Ending/"
	var f = a+"Food/"
	var h = a+"Holders/"
	var i = a+"Ingredients/"
	var o = a+"Orders/"
	var p = a+"Pizza/"
	var ps = p+"Sauce/"
	var s = a+"Sounds/"
	var u = "_Using.png"
	// Preload the assets
	var pre = [a+"Background.png",a+"ButtonEnd.png",a+"ButtonEnd_Hover.png",a+"ButtonStart.png",a+"ConveyorBase.png",a+"ConveyorBelt.png",a+"Logo.png",a+"Menu.png",a+"Parlor.png",f+"Cheese2.png",h+"Box.png",h+"PizzaFront.png",i+"Cheese.png",o+"Menu.png",o+"Tick.png",p+"Base.png",p+"Cheese.png",p+"Crust.png",s+"Device_Hot.mp3",s+"Device_Pizza.mp3",s+"Music.mp3",s+"Splat.mp3"];
	// Add each food asset
	Object.keys(ingredients).forEach(function(food) {
		for(var c = 1; c <= ingredients[food]; c++) { 
			pre.push(f+food+c+".png")
		}
		pre.push(i+food+".png")
	})
	// Add the bottle-related assets
	bottles.forEach(function(bt) {
		for(var d = 1; d <= 4; d++) { 
			pre.push(ps+bt+d+".png")
		}
		pre.push(b+bt+".png",b+bt+"_Using.png",b+bt+"_Squeeze.gif",h+bt+".png",o+bt+".png",p+bt+"_Splat.png",s+"Use_"+bt+".mp3")
	})
	for(var g = 1; g <= 4; g++) { 
		pre.push(e+g+".png")
	}
	preload(pre, function() {
		// Show the main menu
		app.setState("Main")
		$(".loading").toggleClass("in-game loading").removeClass("loading").empty()
		$("body").append('<div class="game"><span class="debug">Debug: Hitboxes Visible</span><img class="logo" src="Assets/Logo.png"><div class="candy-trigger"></div><img class="start-button" src="Assets/ButtonStart.png"><div class="start-text">Play</div><img class="main-menu" src="Assets/Menu.png"></div><audio autoplay loop src="Assets/Sounds/Music.mp3">')
		// Show the hitboxes if dev mode is on
		if(getCookie("showHitboxes") == 1) {
			$(".game").addClass("show-hitboxes")
		}
	}, function(percent) {
		$(".loading-bar").css("width",percent+"%")
	})
})

var mousePos, splatTimer = 0
app.mainLoop(function() {
	switch(app.currentState()) {
		case "Ending":
			var $e = $(".end-button:hover:not([src*='Hover'])")
			if($e.length) {
				$e.attr("src", "Assets/ButtonEnd_Hover.png")
			}
			else if($(".end-button[src*='Hover']:not(:hover)").length) {
				$(".end-button").attr("src", "Assets/ButtonEnd.png")
			}
			break
		case "Game":
			let $t;
			// Move the conveyor belt
			var $c = $(".conveyor")
			$c.each(function() {
				$t = $(this)
				$t.css("left", "+="+conveyorSpeed+"px")
				// Reset the conveyor when a belt has moved off screen
				if(parseInt($t.siblings(":last").css("left")) > 165) {
					$t.siblings(":last").remove()
					$t.parent().prepend('<img class="conveyor" src="Assets/ConveyorBelt.png">')
					$t.siblings().css("left", "")
				}
			})
			// Move the pizza
			if($(".pizza-dough").length) {
				$(".pizza-dough").css("left", "+="+conveyorSpeed+"px")
			}

			// Check for falling objects
			var $f = $(".dropped")
			$f.each(function() {
				$t = $(this)
				if(parseInt($t.css("top")) < 540) {
					// Make them fall
					$t.css("top", "+=8px")
				}
				else {
					$t.remove()
				}
			})
			
			// If a bottle holder should be animated
			var hf = $(".h-animate").first().attr("frame"), pf = $(".p-animate").first().attr("frame")
			if(hf) {
				// Animate the hot sauce return
				var $h = $(".h-animate"), doneH = false
				switch(hf) {
					case "4":
						$h.css("top", "+=27px")
						break
					case "6":
						$h.css("top", "+=81px")
						break
					case "8":
						$h.css("top", "+=50px")
						break
					case "15":
						$h.after('<img class="hot-bottle h-animate" src="Assets/Bottles/Hot.png" style="top:25px">')
						$h.css("top", "-=128px")
						break
					case "19":
						$h.css("top", "-=23px")
						break
					case "21":
						doneH = true
				}
				if(!doneH) {
					$h.first().attr("frame", parseInt(hf)+1)
				}
				else {
					$h.css("top","")
					$h.removeAttr("frame")
					$(".hot").css("pointer-events","")
				}
			}
			if(pf) {
				// Animate the pizza sauce return
				var $p = $(".p-animate"), doneP = false
				switch(pf) {
					case "1":
						$p.css("top", "-=1px")
						break
					case "3":
						$p.css("top", "+=6px")
						break
					case "5":
						$p.css("top", "+=55px")
						break
					case "7":
						$p.css("top", "+=60px")
						break
					case "16":
						$p.first().after('<img class="pizza-bottle p-animate" src="Assets/Bottles/Pizza.png" style="top:70px">')
						$p.css("top", "-=45px")
						break
					case "18":
						$p.css("top", "-=61px")
						break
					case "20":
						$p.css("top", "+=1px")
						doneP = true
				}
				if(!doneP) {
					$p.first().attr("frame", parseInt(pf)+1)
				}
				else {
					$p.css("top","")
					$p.removeAttr("frame")
					$(".pizza").css("pointer-events","")
				}
			}
			
			// Speed up the conveyor
			if(speedUp) {
				conveyorSpeed += .5
				if(conveyorSpeed >= 11) {
					conveyorSpeed = 11
					speedUp = false
				}
			}
			
			// Pizza went off-screen
			if($(".pizza-dough").length && parseInt($(".pizza-dough").css("left")) > 1045) {
				if(completedOrder) {
					NextOrder()
				}
				else {
					// The pizza was wrong
					mistakes++
					tip = 0
					$(".tip").text("")
					// Lower the speed
					conveyorNormalSpeed -= .15
					if(conveyorNormalSpeed <= .75) {
						conveyorNormalSpeed = .75
					}
					// Reset the consecutive number
					consecutivePizzas = 0
				}
				// Reset the pizza
				conveyorSpeed = conveyorNormalSpeed
				completedOrder = speedUp = false
				currentPizza = {sauce:"",ingredients:{}}
				ordersMade++
				pizzasLeft--
				pizzaPc = {l:[],t:[]}
				splatTimer = 0
				$(".order-tick").addClass("hid")
				$(".pizza-dough").remove()
				$(".conveyor-belt").after('<div class="pizza-dough" style="left:'+pizzaStart+'px"><div class="pizza-trigger"></div><img class="base" src="Assets/Pizza/Base.png"><div class="sauce-pizza"></div><img class="crust" src="Assets/Pizza/Crust.png"></div>')
				pizzaStart = -320
				
				// Add the bottle hitbox back if necessary
				if($(".bottle-holding:not(.dropped)").length) {
					$(".game").addClass("bottle-hitbox")
				}
			}
			
			// Using the bottle on the pizza
			if($(".bottle-hitbox .pizza-trigger:hover").length) {
				var sp = $(".sauce-pizza"), type = $(".bottle-squeezing").attr("type").toLowerCase(), other = sp.html().length && !$(".pizza-sauce[type='"+type+"']").length
				if(!$(".full").length || other) {
					var o = $(".pizza-dough").offset(), l = mousePos.pageX-o.left-20, t = mousePos.pageY-o.top+100
					// Clear the other sauce
					if(other) {
						sp.empty()
						pizzaPc = {l:[],t:[]}
						splatTimer = 0
						$(".sauce-tick").addClass("hid")
					}
					// Put a random spot of the sauce
					sp.append('<div class="pizza-sauce '+type+'-'+device.randomNum(1,4)+'" style="left:'+l+'px;top:'+t+'px" type="'+type+'"></div>')
					
					// Store the percentage of area covered
					var pcL = l.roundTo(4), pcT = t.roundTo(4)
					if(!pizzaPc.l.includes(pcL)) {
						pizzaPc.l.push(pcL)
					}
					if(!pizzaPc.t.includes(pcT)) {
						pizzaPc.t.push(pcT)
					}
					
					// If the pizza is mostly covered
					if(pizzaPc.t.length > 20 && pizzaPc.l.length > 30) {
						sp.html('<div class="pizza-sauce '+type+'-1 full" type="'+type+'"></div>')
						// Capitalise the first letter and check the order
						CheckOrder(type.charAt(0).toUpperCase()+type.substring(1))
					}
				}
				else if(splatTimer == splatAfter && !$(".pizza-splat").length) {
					// Show the pizza splat
					$(".pizza-dough").append('<div class="pizza-splat '+type+'"></div>')
					speedUp = true
					
					// Hide the completion ticks
					$(".order-tick").addClass("hid")
					
					// Play the splat sound
					$(".splat-sfx").remove()
					$("body").append('<audio autoplay class="splat-sfx" src="Assets/Sounds/Splat.mp3"></audio>')
				}
				else if(splatTimer < splatAfter) {
					splatTimer++
				}
			}
			
			// The completion info is showing
			if($(".order").hasClass("hid")) {
				infoFrame++
				if(infoFrame == 42) {
					// Hide the info after 42 frames
					$(".completed, .order, .order-image, .order-info, .ingredient-orders").toggleClass("hid")
				}
			}
			
			// Update the stats board
			if($(".stats").length) {
				if($(".pizzas-made").text() != pizzasMade) {
					$(".pizzas-made").text(pizzasMade)
				}
				if($(".pizzas-left").text() != pizzasLeft) {
					$(".pizzas-left").text(pizzasLeft)
				}
				if($(".mistakes").text() != mistakes) {
					$(".mistakes").text(mistakes)
				}
				if($(".coins").text() != coins) {
					$(".coins").text(coins)
				}
			}
			
			// End conditions
			if(mistakes >= 5) {
				if(pizzasMade <= 1) {
					ShowEnding(1)
				}
				else {
					ShowEnding(2)
				}
			}
			else if(ordersMade >= 40) {
				if(pizzasMade >= 40) {
					ShowEnding(4)
				}
				else {
					ShowEnding(3)
				}
			}
			break
	}
	
	// Disable image dragging
	$("img").each(function() {
		if(!$(this).attr("draggable")) {
			$(this).attr("draggable", false)
		}
	})
}, {allowCursor:true})