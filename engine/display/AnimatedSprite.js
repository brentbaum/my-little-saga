"use strict";

/**
 * An Animated Sprite! Doot doot doot.
 * 
 * */
class AnimatedSprite extends Sprite {

    //animations expected to be of format: {"animation-name": {start: 0, end: 3}, ...}
    constructor(id, filename, numFrames, animations) {
        super(id, filename, function() {
            this.width = this.imageWidth / this.numFrames;
        });
        this.frame = 0;
        this.animations = animations;
        this.startIndex = 0;
        this.endIndex = 0;
        this.numFrames = numFrames;
        this.speed = 3;
        this.animationCount = 0;
    }

    animate(k) {
        var animation = this.animations[k];
        this.startIndex = animation.start;
        this.endIndex = animation.end;
    }

    /**
     * Invoked every frame, manually for now, but later automatically if this DO is in DisplayTree
     */
    update() {
        this.animationCount++;
        if(this.animationCount === this.speed) {
            this.animationCount = 0;
            this.frame = (this.frame + 1);
            if(this.frame > this.endIndex)
                this.frame = this.startIndex;
        }
    }

    /**
     * Draws this image to the screen
     */
    draw(g) {
        super.draw(g);
    }
}
