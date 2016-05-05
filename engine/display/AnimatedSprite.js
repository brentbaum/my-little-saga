"use strict";

/**
 * An Animated Sprite! Doot doot doot.
 * 
 * */
class AnimatedSprite extends Sprite {

    //animations expected to be of format: {"animation-name": {start: 0, end: 3}, ...}
    constructor(id, gameObjectId, numFrames, animations, sheet) {
	console.log(gameObjectId);
        super(id, gameObjectId, function() {
            this.width = 200;
            this.height = 200;
        });
        this.frame = 0;
        this.animations = animations;
        this.startIndex = 0;
	this.sheet = sheet;
        this.endIndex = 0;
        this.numFrames = numFrames;
        this.animationSpeed = 100;
	this.curAnim = "stop";
        this.animationCount = 0;
	this.bounds = {x: 0, y: 0, width: this.width, height: this.height};
    }

    animate(k) {
	if (this.curAnim === k)
	    return;

        var animation = this.animations[k];
	this.curAnim = k;
        this.startIndex = animation.start;
        this.endIndex = animation.end;
	this.frame = this.startIndex;
    }

    /**
     * Invoked every frame, manually for now, but later automatically if this DO is in DisplayTree
     */
    update() {
        this.animationCount++;
        if(this.animationCount === this.animationSpeed) {
            this.animationCount = 0;
            this.frame = (this.frame + 1);
            if(this.frame > this.endIndex)  {
                this.frame = this.startIndex;
	    }
	    this.setBounds();
        }
    }

    setBounds() {
	this.bounds = this.sheet[this.frame].frame;
    }

    /**
     * Draws this image to the screen
     */
    draw(g, onScreen) {
	if (this.displayImage) {
            //console.log(onScreen(this));
	    if (this.loaded && this.visible) {// && onScreen(this)) {
		this.applyTransformations(g);
		g.drawImage(this.displayImage, 
			    this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h, 
			    0, 0, this.bounds.w, this.bounds.h);
		this.reverseTransformations(g);
	    }
	}
    }
}
