"use strict";

/**
 * Let's make some trees.
 * 
 * */
class DisplayObjectContainer extends DisplayObject {
    constructor(id, gameObjectId, onload) {
        super(id, gameObjectId, onload);
        this.children = [];
    }

    clearAll() {
        this.children = [];
    }

    contains(DO) {
        return this.children.find(x => x.id === DO.id);
    }

    getChildById(id) {
        return this.children.find(x => x.id === id);
    }

    draw(g) {
        this.applyTransformations(g);
        if(this.displayImage && this.loaded && this.visible) {
            g.drawImage(this.displayImage, this.frame * this.width, 0, this.width, this.height, 0, 0, this.width, this.height);
        }
        for(let child of this.children) {
            child.draw(g);
        }
        this.reverseTransformations(g);
    }

    update(g) {
        for(let child of this.children) {
            child.update();
        }
    }
}
