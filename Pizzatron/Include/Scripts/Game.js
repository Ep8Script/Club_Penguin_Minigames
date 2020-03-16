var pizzasMade = 0, pizzasLeft = 40, mistakes = 0, ordersMade = 0, coins = 0, tip = 0
var conveyorNormalSpeed = 1.5, conveyorSpeed = 1.5, consecutivePizzas = 0, pizzaStart = -320, speedUp = false

var bottles = ["Pizza","Hot"], ingredients = {Cheese:1,Seaweed:3,Shrimp:3,Squid:3,Fish:3}, offsetX = 110, offsetY = 150, offsetB = 8, splatAfter = 160

function StartGame() {
	if(app.currentState() == "Main") {
		app.setState("Game")
		// Add the game scene
		$(".game").html('<img class="background" src="Assets/Background.png"><span class="debug">Debug: Hitboxes Visible</span><img class="menu" src="Assets/Orders/Menu.png"><div class="menu-screen total-1"><span class="order">Cheese Pizza</span><span class="order-info cheese-order">Cheese</span><img class="order-tick cheese-tick hid" src="Assets/Orders/Tick.png"><span class="order-info sauce-order"><span>Pizza</span> Sauce</span><img class="order-tick sauce-tick hid" src="Assets/Orders/Tick.png"><span class="order-info extra-1"><span class="count"></span> <span class="ingredient"></span></span><img class="order-tick extra-1-tick hid" src="Assets/Orders/Tick.png"><span class="order-info extra-2"><span class="count"></span> <span class="ingredient"></span></span><img class="order-tick extra-2-tick hid" src="Assets/Orders/Tick.png"><span class="order-info extra-3"><span class="count"></span> <span class="ingredient"></span></span><img class="order-tick extra-3-tick hid" src="Assets/Orders/Tick.png"><span class="order-info extra-4"><span class="count"></span> <span class="ingredient"></span></span><img class="order-tick extra-4-tick hid" src="Assets/Orders/Tick.png"><img class="order-image" src="Assets/Orders/Pizza.png"><span class="completed done hid">Done!</span><span class="completed earned hid">+5 coins!</span><span class="completed tip hid"></span><img class="completed hid" src="Assets/Orders/Tick.png"><div class="stats"><div class="pizzas-made">0</div><div class="pizzas-left">40</div><div class="mistakes">0</div></div><div class="coins-label">Coins</div><div class="coins">0</div></div><img class="conveyor-base" src="Assets/ConveyorBase.png"><img class="sauce-box" src="Assets/Holders/Box.png"><div class="bottle-container"><img class="pizza-holder p-animate" src="Assets/Holders/Pizza.png"><img class="pizza-bottle" src="Assets/Bottles/Pizza.png"><img class="pizza-front p-animate" src="Assets/Holders/PizzaFront.png"><img class="hot-holder h-animate" src="Assets/Holders/Hot.png"><img class="hot-bottle" src="Assets/Bottles/Hot.png"></div><div class="bottle-trigger pizza"></div><div class="bottle-trigger hot"></div><img class="cheese-holder" src="Assets/Ingredients/Cheese.png"><div class="ingredient-trigger cheese"></div><div class="ingredient-trigger cheese second"></div><img class="seaweed-holder" src="Assets/Ingredients/Seaweed.png"><div class="ingredient-trigger seaweed"></div><div class="ingredient-trigger seaweed second"></div><div class="ingredient-trigger seaweed third"></div><img class="shrimp-holder" src="Assets/Ingredients/Shrimp.png"><div class="ingredient-trigger shrimp"></div><div class="ingredient-trigger shrimp second"></div><div class="ingredient-trigger shrimp third"></div><img class="squid-holder" src="Assets/Ingredients/Squid.png"><div class="ingredient-trigger squid"></div><img class="fish-holder" src="Assets/Ingredients/Fish.png"><div class="ingredient-trigger fish"></div><div class="conveyor-belt"></div><div class="pizza-dough" style="left:-345px"><div class="pizza-trigger"></div><img class="base" src="Assets/Pizza/Base.png"><div class="sauce-pizza"></div><img class="crust" src="Assets/Pizza/Crust.png"></div>')
		
		// Add the conveyor belt to the scene
		for(var i = 0; i < 10; i++) {
			$(".conveyor-belt").append('<img class="conveyor" src="Assets/ConveyorBelt.png">')
		}
		
		// Set the order
		order = orders[0]
	}
}

// Pick up an ingredient
function GetIngredient(name, mouse, game) {
	if(app.currentState() == "Game" && !$(".ingredient-holding:not(.dropped)").length) {
		// Get the mouse position
		var left = mouse.pageX - offsetX - game.offsetLeft, top = mouse.pageY - offsetY - game.offsetTop
		// Put the food in the world with a random image
		$(".game").append('<img class="ingredient-holding" food="'+name+'" src="Assets/Food/'+name+device.randomNum(1, ingredients[name])+'.png" style="left:'+left+'px;top:'+top+'px">')
		// Make the mouse a pointer
		$(".game").addClass("hold")
	}
}

// Drop an ingredient
function DropIngredient(i, e) {
	var food = i.attr("food")
	if($(".pizza-dough").length && $(".pizza-trigger:hover").length && !$(".pizza-splat").length && !completedOrder) {
		// Put the ingredient on the pizza
		if(food == "Cheese") {
			$(".pizza-dough").append('<img class="cheese" src="Assets/Pizza/'+food+'.png">')
		}
		else {
			var o = $(".pizza-dough").offset(), l = e.pageX-o.left-65, t = e.pageY-o.top-75
			$(".pizza-dough").append('<img class="food" src="'+i.attr("src")+'" style="left:'+l+'px;top:'+t+'px;transform:scale(0.75)">')
		}
		i.remove()
		CheckOrder(food)
	}
	else {
		// Release the ingredient
		i.addClass("dropped")
		if(food == "Cheese") {
			i.attr("src",i.attr("src").replace("1","2"))
		}
	}
	
	// Reset the mouse cursor
	$(".game").removeClass("hold")
}

var bottleTimeout = {"Hot":false,"Pizza":false}
// Pick up and use a bottle
function UseBottle(bottle, mouse, game) {
	if(app.currentState() == "Game" && !$(".bottle-holding:not(.dropped)").length) {
		// Get the mouse position
		var left = mouse.pageX-offsetX-offsetB-game.offsetLeft, top = mouse.pageY-offsetY-offsetB-game.offsetTop
		// Put the bottle in the world
		$(".game").append('<img class="bottle-holding" src="Assets/Bottles/'+bottle+'_Using.png" style="left:'+left+'px;top:'+top+'px"><img class="bottle-squeezing" src="Assets/Bottles/'+bottle+'_Squeeze.gif" style="left:'+(left+64.5)+'px;top:'+(top+217)+'px" type="'+bottle+'">')
		
		// Prepare the pizza hitbox
		if(!completedOrder) {
			$(".game").addClass("bottle-hitbox")
		}
		
		// Delete the original bottle
		$("."+bottle.toLowerCase()+"-bottle").remove()
		
		// Animate the holder
		$("."+bottle[0].toLowerCase()+"-animate").first().attr("frame", "0")
		$("."+bottle.toLowerCase()).css("pointer-events","none")
		
		// Cancel the previous sound
		if(bottleTimeout[bottle]) {
			$("."+bottle+"-device").remove()
			clearTimeout(bottleTimeout[bottle])
			bottleTimeout[bottle] = false
		}
		// Play the device and bottle sounds
		$("body").append('<audio autoplay class="'+bottle+'-device" src="Assets/Sounds/Device_'+bottle+'.mp3"></audio><audio autoplay class="bottle-squeeze" loop src="Assets/Sounds/Use_'+bottle+'.mp3"></audio>')
		
		// Remove the device sound
		bottleTimeout[bottle] = setTimeout(function() {
			$("."+bottle+"-device").remove()
			bottleTimeout[bottle] = false
		}, 1500)
		// Duplicate the squeeze sound (so it loops faster)
		setTimeout(function() {
			if($("."+bottle+"-device").length) {
				$(".bottle-squeeze").after('<audio autoplay class="bottle-squeeze" loop src="Assets/Sounds/Use_'+bottle+'.mp3"></audio>')
			}
		}, 350)
	}
}

// Drop a bottle
function DropBottle(b) {
	if(app.currentState() == "Game") {
		// Reset the bottle's image
		b.attr("src", b.attr("src").replace("_Using",""))
		// Release the bottle
		b.addClass("dropped")
		$(".bottle-squeeze, .bottle-squeezing").remove()
		
		// Reset the hitbox
		$(".game").removeClass("bottle-hitbox")
	}
}

// Go to a specified ending
function ShowEnding(number) {
	if(typeof number != "number") {
		number = 1
	}
	
	if(app.currentState() == "Game") {
		// Calculate the coins earned
		var sales = pizzasMade*5, tips = coins-sales
		// Show the chosen end screen
		$(".game").html('<img class="ending" src="Assets/Ending/'+number+'.png"><span class="score">Score</span><span class="pizzas-sold">Pizzas Sold</span><div class="pizzas-sold">'+pizzasMade+'</div><span class="sales">Sales</span><div class="sales">'+sales+'</div><span class="sales-coins">Coins</span><span class="tips">Tips</span><div class="tips">'+tips+'</div><span class="tips-coins">Coins</span><span class="total">Total</span><div class="total">'+coins+'</div><span class="total-coins">Coins</span><img class="end-button" src="Assets/ButtonEnd.png"><div class="end-text">Play Again?</span>')
		
		// Play the sound effect
		$("body").removeClass("bottle-hitbox hold").append('<audio autoplay class="ending-sfx" src="Assets/Sounds/Cash.mp3"></audio>')
		$(".bottle-squeeze").remove()
		app.setState("Ending")
	}
}

// Rounding function for sauce detection
Number.prototype.roundTo = function(num) {
	var resto = this%num;
	if (resto <= (num/2)) { 
		return this-resto;
	}
	else {
		return this+num-resto;
	}
}

// Check if the client is a mobile device
function testMobile() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))||getCookie("wasMobile")) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	// Set the cookie if not already set
	if(check && !getCookie("wasMobile")) {
		setCookie("wasMobile", 1, 1)
	}
	return check;
}