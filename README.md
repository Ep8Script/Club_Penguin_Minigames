# Club Penguin Minigames
Recreating a few of Club Penguin's minigames in HTML5.

# Available games
* [Bean Counters](https://ep8script.github.io/Club_Penguin_Minigames/BeanCounters)
* [Pizzatron 3000](https://ep8script.github.io/Club_Penguin_Minigames/Pizzatron)
* [Sled Racing](https://ep8script.github.io/Club_Penguin_Minigames/SledRacing)

# Changelog
### v1.0.0
* Added Bean Counters.
	* Playable on PC via the arrow keys and spacebar, or the Nintendo Switch via the gamepad controls.
### v1.1.0
* Added Sled Racing.
	* Playable on PC's in both single and multiplayer versions. *(Currently available in single player only due to server-client sync issues.)* 
	* Up to 4 players can play together and there are 4 different maps which are randomly cycled.
	* The server for Sled Racing is created in Node.js, and unfortunately does not have guaranteed 100% uptime at this time.
* Updated Bean Counters.
	* Added VR Mode.
		* By playing on the Switch in handheld mode, the VR option can be selected from the main menu, allowing the user to play the game in 3D with Nintendo Labo VR Goggles.
		* The view is not moveable and has a similar effect to viewing from a 3D TV.
		* *VR Mode is currently disabled while it continues to be improved. Check back at a later update for its availability!*
	* Added mouse controls to PC. Move the mouse left and right to control the player and click to release bags to the side.
	* This change more closely reflects the original game.
	* Reduced the frame rate from 60 to 25 in an attempt to cause less lag.
	* Bug fixes:
		* New hazards will no longer spawn when the truck is swapping between levels.
### v1.1.1
* Fixed some issues in both minigames.
### v1.1.2
* Adjusted the loading screens in both minigames to be properly centered.
* Updated Bean Counters.
	* Changed the title screen art to one of much higher resolution.
	* Disabled some assets from being able to be dragged.
	* Removed the pointer icon from the minigame logo.
* Big thanks to [Aurorum](https://github.com/Aurorum) for these improvements!
### v1.1.3
* Updated Sled Racing.
	* Fixed an issue causing a sprite swap to not properly occur for the first few frames of crashing.
### v1.1.4
* Updated Sled Racing
	* Added a background image which stops the game from being surrounded by boring black bars on larger screens.
	* Fixed an issue causing the sky image to extend past the game's borders.
		* Thanks again to [Aurorum](https://github.com/Aurorum) for making these changes!
	* Fixed an issue causing the loading bar to not work at the start of the game.
### v2.0.0
* A fresh new look for the minigames landing page is coming soon!
* Added Pizzatron 3000.
	* Share your high scores with [#PizzatronScore](https://twitter.com/hashtag/pizzatronscore)!
	* The Candytron 3000 is currently unavailable and may not ever be added.
* Updated Bean Counters.
	* Added music and sound effects.
	* Put the minigame inside a box to ensure the same visuals across all screen sizes and for consistency with the other two.
	* Bug fixes:
		* The bag placed immediately before the truck leaves is now properly added to the stack.
		* The Joy-Con start button now only shows on the Nintendo Switch.
* Updated Sled Racing.
	* The loading sequence now takes place inside the minigame's box for consistency with the rest of the game.
	* Updated the mobile device detection.
### v2.0.1
* Fixed an issue in Bean Counters and Pizzatron causing the cursor position to be inaccurate on larger displays.
	* Thanks to [Maschell](https://github.com/Maschell) for the quick find!