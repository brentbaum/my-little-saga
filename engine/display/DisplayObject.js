"use strict";

/**
 * A very basic display object for a javascript based gaming engine
 * 
 * */
class DisplayObject {
    constructor(id, gameObjectId, onload) {
	this.id = id;
	this.loaded = false;
	this.type = gameObjectId;
	if (!!gameObjectId) {
	    this.loadImage(GameObjects[gameObjectId].filename);
	} else {
	    this.imageWidth = this.width = this.height = 0;
	    this.displayImage = {
		width: 0,
		height: 0
	    };
	}
	this.visible = true;
	this.position = {
	    x: 0,
	    y: 0
	};
	this.pivotPoint = {
	    x: 0,
	    y: 0
	};
	this.scale = {
	    x: 1,
	    y: 1
	};
	this.rotation = 0; // in radians
	this.alpha = 1;
	this.frame = 0;
	this.onImageLoad = onload;
	this.parent = null;
	this.physics = {
	    gravity: false
	};
	this.vel = {
	    x: 0,
	    y: 0
	};
	this.maxVel = {
	    x: 3,
	    y: 10
	};

	this.tweenParams = ["posX", "posY", "scaleX", "scaleY", "width", "height", "rotation", "alpha"];
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
	    if (!!t.onImageLoad) {
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
	g.translate(-this.position.x - this.displayImage.width / 2 - this.pivotPoint.x, -this.position.y - this.displayImage.height / 2 - this.pivotPoint.y);
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
     * "THIS AREA CONTAINS MOSTLY GETTERS AND SETTERS!"
     * - Floryan, 2015
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

    get posX() {
	return this.position.x;
    }

    set posX(x) {
	this.position.x = x;
    }

    get posY() {
	return this.position.y;
    }
    set posY(y) {
	this.position.y = y;
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

    get velocityX() {
	return this.vel.x;
    }

    get velocityY() {
	return this.vel.y;
    }

    set velocityX(val) {
	this.vel.x = Math.sign(val) * Math.min(Math.abs(val), this.maxVel.x);
    }

    set velocityY(val) {
	this.vel.y = Math.sign(val) * Math.min(Math.abs(val), this.maxVel.y);
    }

    updatePositions() {
	this.position.x += this.vel.x;
	this.position.y += this.vel.y;
	for (var child of this.children) {
	    child.updatePositions();
	}
    }

    getHitBox() {
	return {
	    x1: this.position.x,
	    y1: this.position.y,
	    x2: this.position.x + this.width * this.scale.x,
	    y2: this.position.y + this.height * this.scale.y
	};
    }

    collidesWith(other, offset) {
	var t = this.getHitBox();
	var o = other.getHitBox();
	o.x1 += offset.x;
	o.x2 += offset.x;
	o.y1 += offset.y;
	o.y2 += offset.y;

	var d = this.directCollide(t, o, other);
	if (d) {
	    return d;
	}
	var p = this.proximityCollide(t, o, other);
	return p ? "proximity" : false;
    }

    directCollide(t, o, other) {
	//minsowski sum works well, as we want direction too.
	var w = 0.5 * (this.width * this.scale.x + other.width * other.scale.x);
	var h = 0.5 * (this.height * this.scale.y + other.height * other.scale.y);

	return this.collisionDirection(w, h, t, o);
    }

    proximityCollide(t, o, other) {
	var range = 2;
	var w = 0.5 * (this.width * this.scale.x + other.width * other.scale.x * range);
	var h = 0.5 * (this.height * this.scale.y + other.height * other.scale.y * range);
	var o1 = {
	    x1: o.x1 - other.width / range,
	    x2: o.x2 + other.width / range,
	    y1: o.y1 - other.height / range,
	    y2: o.y2 + other.width / range
	};

	return this.collisionDirection(w, h, t, o1);
    }

    collisionDirection(w, h, t, o) {
	var dx = ((t.x2 - t.x1) / 2 + t.x1) - ((o.x2 - o.x1) / 2 + o.x1);
	var dy = ((t.y2 - t.y1) / 2 + t.y1) - ((o.y2 - o.y1) / 2 + o.y1);
	if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
	    /* collision! */
	    var wy = w * dy;
	    var hx = h * dx;

	    if (wy > hx)
		if (wy > -hx)
		    return "top";
	    else
		return "left";
	    else
		if (wy > -hx)
		    return "right";
	    else
		return "bottom";
	}

	return t.x1 < o.x2 && t.x2 > o.x1 && t.y1 < o.y2 && t.y2 > o.y1;
    }

    distanceFrom(other) {
	var tBox = this.getHitBox();
	var oBox = other.getHitBox();

	var c1 = {
	    x: (tBox.x1 + tBox.x2) / 2,
	    y: (tBox.y1 + tBox.y2) / 2
	};
	var c2 = {
	    x: (oBox.x1 + oBox.x2) / 2,
	    y: (oBox.y1 + oBox.y2) / 2
	};

	return Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c2.x - c2.y, 2));
    }
}
