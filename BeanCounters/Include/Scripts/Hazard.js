var spawnInterval = setInterval(function(){},100000)

// Spawn a hazard every second
function StartHazards() {
	var interval = 1000
	if(truck<3) {
		interval+=200
	}
	else if(truck==5) {
		interval = 600
	}
	spawnInterval = setInterval(function() {
		newHazard()
		
		// Maybe spawn a second one (more likely after first level)
		if(!device.randomNum(0,truck==1?5:2)) {
			setTimeout(newHazard, 395)
		}
	}, interval)
	
	// One hazard immediately
	newHazard()
}

// Create a new hazard
function newHazard() {
	var anvil = {name:"Anvil",chance:[],min:580,max:650}
	var bag = {name:"Bag",chance:[],min:200,max:645}
	var fish = {name:"Fish",chance:[],min:200,max:340}
	var vase = {name:"Vase",chance:[],min:415,max:575}
	var hazards = []
	switch(truck) {
		case 2:
			anvil.chance = [1,2,3,4,5,6,7]
			bag.chance = [8,9,10,11,12,13,14,15,16,17,18,19,20]
			hazards = [anvil,bag]
			break
		case 3:
			anvil.chance = [1,2,3,4,5,6]
			bag.chance = [7,8,9,10,11,12,13,14]
			fish.chance = [15,16,17,18,19,20]
			hazards = [anvil,bag,fish]
			break
		case 4:
		case 5:
			anvil.chance = [1,2,3,4]
			bag.chance = [5,6,7,8,9,10]
			fish.chance = [11,12,13,14,15]
			vase.chance = [16,17,18,19,20]
			hazards = [anvil,bag,fish,vase]
			break
		default:
			bag.chance = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
			hazards = [bag]
	}
	
	// Get the hazard
	var hazard = false
	var random = device.randomNum(1,21)
	if(random > 20) {
		if(truck == 3 || truck == 5) {
			hazard = {name:"Life",min:300,max:690}
		}
		else {
			random = device.randomNum(1,20)
		}
	}
	$.each(hazards, function(i, h) {
		if(h.chance.includes(random)) {
			hazard = h
		}
	})
	
	if(hazard) {
		var img = hazard.name=="Bag"?"Bag_1":hazard.name
	
		$(".play-area").first().append('<img class="hazard '+hazard.name.toLowerCase()+'" name="'+hazard.name+'" style="bottom: 320px; left: 825px;" src="Assets/Hazards/'+img+'.png">')
		 
		var $h = $(".play-area").first().find(".hazard").last()
		var fall = 4
		var launchTo = device.randomNum(hazard.min,hazard.max)
		if(launchTo > 470) {
			fall = 1
			launchTo += 80
		}
		var maxHeight = device.randomNum(390, 404)
		
		var move = function() {
			if(!$h.length || $h.hasClass("broken") || $h.attr("gone")) {
				return
			}
			if(parseInt($h.css("left")) > launchTo) {
				$h.css("left", "-=10")
			}
			else if(launchTo < 470) {
				$h.css("left", "-=5")
			}
			else {
				$h.css("left", "-=1.85")
			}
			if(parseInt($h.css("bottom")) < maxHeight && !$h.attr("fallin")) {
				$h.css("bottom", "+=4.5")
			}
			else if($h.attr("fallin")) {
				if($h.attr("fallin") == fall) {
					if(parseInt($h.css("bottom")) <= 70) {
						$h.addClass("broken")
						if(hazard.name != "Life") {
							$h.attr("src", "Assets/Hazards/"+hazard.name+"_Broken.png")
							$h.delay(500).fadeOut("fast", function() {
								$h.remove()
							})
							// Play the land sound
							$("."+(hazard.name.toLowerCase())+"-land").remove()
							$("body").append('<audio autoplay class="'+(hazard.name.toLowerCase())+'-land" src="Assets/Sounds/'+hazard.name+'_Land.mp3"></audio>')
						}
						else {
							$h.fadeOut("fast", function() {
								$h.remove()
							})
						}
					}
					else if(launchTo < 470) {
						$h.css("bottom", "-=10")
					}
					else {
						$h.css("bottom", "-=13.6")
					}
				}
				else {
					$h.attr("fallin", parseInt($h.attr("fallin"))+1)
				}
			}
			else {
				$h.attr("fallin", 0)
			}
			setTimeout(function() {
				move()
			}, 12)
		}
		
		// Wait a few ms before launching
		setTimeout(function() {
			move()
		}, 8)
		
		// If the hazard is a bag, animate it
		if(hazard.name == "Bag") {
			setTimeout(function() {
				$h.attr("src", "Assets/Hazards/Bag_2.png")
				setTimeout(function() {
					$h.attr("src", "Assets/Hazards/Bag_3.png")
				}, 185)
			}, device.isSwitch?315:200)
		}
	}
}

// Collision detection
function collidesWith(element1, element2) {
    var Element1 = {};
    var Element2 = {};

    Element1.top = $(element1).offset().top;
    Element1.left = $(element1).offset().left;
    Element1.right = Number($(element1).offset().left) + Number($(element1).width());
    Element1.bottom = Number($(element1).offset().top) + Number($(element1).height());

    Element2.top = $(element2).offset().top;
    Element2.left = $(element2).offset().left;
    Element2.right = Number($(element2).offset().left) + Number($(element2).width());
    Element2.bottom = Number($(element2).offset().top) + Number($(element2).height());

    return Element1.right > Element2.left && Element1.left < Element2.right && Element1.top < Element2.bottom && Element1.bottom > Element2.top;
}