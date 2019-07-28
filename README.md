# Club Penguin Minigames
Recreating a few of Club Penguin's minigames in HTML5.

# Available games
* [Bean Counters](https://clubpenguin-minigames.ep8script.com/BeanCounters)
* [Sled Racing](https://clubpenguin-minigames.ep8script.com/SledRacing)

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
		 * *VR Mode is current disabled while it continues to be improved. Check back at a later update for its availability!*
	 * Added mouse controls to PC. Move the mouse left and right to control the player and click to release bags to the side.
		 * This change more closely reflects the original game.
	 * Reduced the frame rate from 60 to 25 in an attempt to cause less lag.
	 * Bug fixes:
		 * New hazards will no longer spawn when the truck is swapping between levels.
### v1.1.1
* Fixed some issues in both minigames.