"use strict";

/**
 * A very basic Sprite. For now, does not do anything.
 * 
 * */
class Sprite extends DisplayObjectContainer {

    constructor(id, filename, onload) {
        super(id, filename, onload);
    }

    /**
     * Invoked every frame, manually for now, but later automatically if this DO is in DisplayTree
     */
    update() {

    }

    /**
     * Draws this image to the screen
     */
    draw(g) {
        super.draw(g);
    }
}
