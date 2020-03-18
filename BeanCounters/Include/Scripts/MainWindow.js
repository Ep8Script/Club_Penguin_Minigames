app.mainLoop(function() {
	// Reset the zoom level
	$("body").css("zoom", innerWidth / outerWidth)
	
	// Scale the game to fit screens
	var g = $(".game-box")
	g.css("transform", "scale("+1/Math.min(g[0].clientWidth/innerWidth,g[0].clientHeight/innerHeight)+")")
}, {fps:30})