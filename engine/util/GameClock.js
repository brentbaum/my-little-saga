"use strict";

/**
 * A very clock for keeping time (between frames or otherwise)
 * 
 * */
class GameClock{
	
	constructor(){
		this.resetGameClock();
	}

	/**
	 * Returns Milliseconds passed since the last time resetGameClock() was called
	 */
	getElapsedTime(){
		return new Date().getTime() - this.start;
	}

	resetGameClock(){
		this.start = new Date().getTime();
	}
}

