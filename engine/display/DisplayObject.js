"use strict";

/**
 * A very basic display object for a javascript based gaming engine
 * 
 * */
class DisplayObject {

    constructor(id, filename, onload) {
        this.id = id;
        this.loaded = false;
        if(!!filename) {
            this.loadImage(filename);
        } else {
            this.imageWidth = this.width = this.height = 0;
            this.displayImage = {width: 0, height: 0};
        }
        this.visible = true;
        this.position = {x: 0, y: 0};
        this.pivotPoint = {x: 0, y: 0};
        this.scale = {x: 1, y: 1};
        this.rotation = 0; // in radians
        this.alpha = 1;
        this.frame = 0;
        this.onImageLoad = onload;
        this.parent = null;
    }

    /**
     * Loads the image, sets a flag called 'loaded' when the image is ready to be drawn
     */
    loadImage(filename) {
        var t = this;
        this.displayImage = new Image();
        this.displayImage.onload = function() {
            t.imageWidth = t.width = t.displayImage.width;
            t.height = t.displayImage.height;
            t.loaded = true;
            if(!!t.onImageLoad) {
                t.onImageLoad();
            }
        };
        this.displayImage.src = 'resources/' + filename;
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
        if (this.displayImage) {
            if (this.loaded && this.visible) {
                this.applyTransformations(g);
                g.drawImage(this.displayImage, this.frame * this.width, 0, this.width, this.height, 0, 0, this.width, this.height);
                this.reverseTransformations(g);
            }
        }
    }

    /**
     * Applies transformations for this display object to the given graphics
     * object
     * */
    applyTransformations(g) {
        g.save();
        g.translate(this.position.x + this.displayImage.width / 2 + this.pivotPoint.x,
                    this.position.y + this.displayImage.height / 2 + this.pivotPoint.y);
        g.rotate(this.rotation);
        g.translate(-this.position.x -this.displayImage.width / 2 - this.pivotPoint.x,
                    -this.position.y -this.displayImage.height / 2 - this.pivotPoint.y);
        g.translate(this.position.x, this.position.y);
        g.scale(this.scale.x, this.scale.y);
        g.globalAlpha = this.alpha;
    }

    /**
     * Reverses transformations for this display object to the given graphics
     * object
     * */
    reverseTransformations(g) {
        g.restore();
    }

    /**
     * THIS AREA CONTAINS MOSTLY GETTERS AND SETTERS!
     *
     */

    setId(id) {
        this.id = id;
    }
    getId() {
        return this.id;
    }

    setDisplayImage(image) {
        this.displayImage = image;
    } //image needs to already be loaded!
    getDisplayImage() {
        return this.displayImage;
    }

    getUnscaledHeight() {
        return this.displayImage.height;
    }
    getUnscaledWidth() {
        return this.displayImage.width;
    }

    getVisible() {
        return this.visible;
    }
    setVisible(b) {
        this.visible = b;
    }

    get scaleX() {
        return this.scale.x;
    }
    set scaleX(s) {
        this.scale.x = s;
    }

    get scaleY() {
        return this.scale.y;
    }
    set scaleY(s) {
        this.scale.y = s;
    }
}
