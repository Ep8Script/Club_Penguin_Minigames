var order, currentPizza = {sauce:"",ingredients:{}}, completedOrder = false, pizzaPc = {l:[],t:[]}, infoFrame

// List the orders
var orders = [{name:"Cheese Pizza",sauce:"Pizza",ingredients:{"Cheese":1}},{name:"Hot Cheese Pizza",sauce:"Hot",ingredients:{"Cheese":1}},{name:"Seaweed Pizza",sauce:"Pizza",ingredients:{"Cheese":1,"Seaweed":5}},{name:"Spicy Seaweed Pizza",sauce:"Hot",ingredients:{"Cheese":1,"Seaweed":5}},{name:"Shrimp Pizza",sauce:"Pizza",ingredients:{"Cheese":1,"Shrimp":5}},{name:"Hot Shrimp Pizza",sauce:"Hot",ingredients:{"Cheese":1,"Shrimp":5}},{name:"Squid Pizza",sauce:"Pizza",ingredients:{"Cheese":1,"Squid":5}},{name:"Spicy Squid Pizza",sauce:"Hot",ingredients:{"Cheese":1,"Squid":5}},{name:"Fish Pizza",sauce:"Pizza",ingredients:{"Cheese":1,"Fish":5}},{name:"Flamethrower Fish Pizza",sauce:"Hot",ingredients:{"Cheese":1,"Fish":5}},{name:"Seaweed-Shrimp Pizza",sauce:"Pizza",ingredients:{"Cheese":1,"Seaweed":2,"Shrimp":2}},{name:"Hot Seaweed-Shrimp Pizza",sauce:"Hot",ingredients:{"Cheese":1,"Seaweed":2,"Shrimp":2}},{name:"Fish Dish Pizza",sauce:"Pizza",ingredients:{"Cheese":1,"Squid":2,"Fish":2}},{name:"Hot Fish Dish Pizza",sauce:"Hot",ingredients:{"Cheese":1,"Squid":2,"Fish":2}},{name:"Seaweed-Squid Pizza",sauce:"Pizza",ingredients:{"Cheese":1,"Seaweed":2,"Squid":2}},{name:"Hot Seaweed-Squid Pizza",sauce:"Hot",ingredients:{"Cheese":1,"Seaweed":2,"Squid":2}},{name:"Fish Shrimp Pizza",sauce:"Pizza",ingredients:{"Cheese":1,"Shrimp":2,"Fish":2}},{name:"Hot Fish Shrimp Pizza",sauce:"Hot",ingredients:{"Cheese":1,"Shrimp":2,"Fish":2}},{name:"Seaweed Fish Pizza",sauce:"Pizza",ingredients:{"Cheese":1,"Seaweed":2,"Fish":2}},{name:"Hot Seaweed Fish Pizza",sauce:"Pizza",ingredients:{"Cheese":1,"Seaweed":2,"Fish":2}},{name:"Shrimp Squid Pizza",sauce:"Pizza",ingredients:{"Cheese":1,"Shrimp":2,"Squid":2}},{name:"Hot Shrimp Squid Pizza",sauce:"Hot",ingredients:{"Cheese":1,"Shrimp":2,"Squid":2}},{name:"Supreme Pizza",sauce:"Pizza",ingredients:{"Cheese":1,"Seaweed":1,"Shrimp":1,"Squid":1,"Fish":1}},{name:"Supreme Sizzle Pizza",sauce:"Hot",ingredients:{"Cheese":1,"Seaweed":1,"Shrimp":1,"Squid":1,"Fish":1}}], possible = 2

// Check the order
function CheckOrder(topping) {
	// Split ingredients and sauces
	if(Object.keys(ingredients).includes(topping)) {
		if((!Object.keys(order.ingredients).includes(topping) || topping != "Cheese" && typeof currentPizza.ingredients[topping] == "number" && currentPizza.ingredients[topping] == order.ingredients[topping]) && conveyorSpeed == conveyorNormalSpeed) {
			// Failed order
			speedUp = true
		}
		else {
			// A valid topping
			var count = 0
			// If not cheese, get the current amount
			if(topping != "Cheese") {
				count = currentPizza.ingredients[topping]?currentPizza.ingredients[topping]:0
			}
			else {
				$(".cheese-tick").removeClass("hid")
			}
			currentPizza.ingredients[topping] = count+1
		}
	}
	else if(bottles.includes(topping)) {
		currentPizza.sauce = topping
		$s = $(".sauce-tick")
		if(order.sauce == topping) {
			$s.removeClass("hid")
		}
	}
	
	// Check if the order is completed
	var success = true
	Object.keys(order.ingredients).forEach(function(i, id) {
		if(order.ingredients[i] != currentPizza.ingredients[i]) {
			success = false
			if(id) {
				$(".extra-"+id+"-tick").addClass("hid")
			}
		}
		else {
			// Tick the ingredient when done
			if(id) {
				$(".extra-"+id+"-tick").removeClass("hid")
			}
		}
	})
	if(success && order.sauce == currentPizza.sauce) {
		completedOrder = speedUp = true
		$(".game").removeClass("bottle-hitbox")
	}
}

// Get the next order
function NextOrder() {
	// Increas conveyor speed
	conveyorNormalSpeed += .225
	if(conveyorNormalSpeed >= 5.5) {
		conveyorNormalSpeed = 5
	}
	// Check the consecutive pizzas
	consecutivePizzas++
	if(consecutivePizzas == 5) {
		// Increase the tip every 5 completed pizzas, maximum 35
		if(!tip) {
			tip = 10
		}
		else if(tip < 35) {
			tip += 5
		}
		consecutivePizzas = 0
		// Put it on the menu
		$(".tip").text("+"+tip+" tip!")
	}
	// Give the coins
	coins += 5 + tip
	
	pizzasMade++
	pizzaStart = -385
	
	// Show on the menu
	$(".completed, .order, .order-image, .order-info, .ingredient-orders").toggleClass("hid")
	infoFrame = 0
	
	GetNextOrder()
}
// Get a random order
function GetNextOrder() {
	if($(".order").hasClass("hid")) {
		possible = pizzasMade
		if(possible > orders.length) {
			possible = orders.length
		}
		// Get the new order
		order = orders[device.randomNum(0,possible-1)]
		
		// Reset the ingredient slots
		$(".order-info span").empty()
		$(".ingredient-orders").remove()
		
		// Display it
		$(".order").text(order.name)
		$(".order-image").attr("src", "Assets/Orders/"+order.sauce+".png")
		$(".sauce-order span").text(order.sauce)
		
		// Get the extra ingredients
		Object.keys(order.ingredients).forEach(function(f,i) {
			if(i) {
				// Add the info to the menu
				$(".extra-"+i).find(".count").text(order.ingredients[f]).next().text(f)
				$(".done").before('<div class="ingredient-orders ingredient-'+i+' ingredient-'+(f.toLowerCase())+' hid"></div>')
				for(var c = 0; c < order.ingredients[f]; c++) {
					// Add an image for each ingredient
					let img = f=="Squid"?2:1
					$(".ingredient-orders").last().append('<img class="'+f.toLowerCase()+'-'+(c+1)+'" src="Assets/Food/'+f+img+'.png">')
				}
				// Store the ingredient count
				$(".menu-screen").attr("total", Object.keys(order.ingredients).length)
			}
		})
	}
}