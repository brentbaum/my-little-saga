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

    draw(g, onScreen) {
        this.applyTransformations(g);
        if(!onScreen)
            debugger;
        if(this.displayImage && this.loaded && this.visible && onScreen(this)) {
            try{
                g.drawImage(this.displayImage, this.frame * this.width, 0, this.width, this.height, 0, 0, this.width, this.height);
            } catch(err){
                // skip it i guess, its outside of the screen anyway
            }
        }
        for(let child of this.children) {
            child.draw(g, onScreen);
        }
        this.reverseTransformations(g);
    }

    update(g) {
        for(let child of this.children) {
            child.update();
        }
    }
}
