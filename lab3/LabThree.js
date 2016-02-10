"use strict";

/**
 * Tree
 */
class LabTwoGame extends Game {
    constructor(canvas) {
        var size = {
            x: 800,
            y: 500
        };
        super("Lab Tree Game", size.x, size.y, canvas);
        this.size = size;
        var marioAnimations = {
            "run": {
                start: 1,
                end: 3
            },
            "hit": {
                start: 4,
                end: 6
            },
            "jump": {
                start: 7,
                end: 14
            }
        };
        //instantiate with the id, filename, number of frames, and the animation map.
        var animated = new AnimatedSprite("Mario1", "super-mario-sprite.png", 21, marioAnimations);
        animated.speed = 10;
        animated.alpha = .5;
        animated.animate("run");

        var boring = new Sprite("Mario2", "Mario.png");
        boring.position = {
            x: 400,
            y: 0
        };
        boring.rotation = .5;

        this.translate = new DisplayObjectContainer("translate");
        this.scale = new DisplayObjectContainer("scale");
        this.rotate = new DisplayObjectContainer("rotate");

        this.root = new DisplayObjectContainer("Root");
        this.translate.children = [animated, boring];
        this.scale.children = [animated, boring];
        this.rotate.children = [animated, boring];
        this.root.children = [this.translate, this.scale, this.rotate];
    }

    update(pressedKeys) {
        if (pressedKeys.includes(keycodes.right)) {
            this.translate.position.x++;
            this.rotate.rotation += .1;
            this.scale.scaleX *= 1.02;
            console.log("right");
        }
        if (pressedKeys.includes(keycodes.left)) {
            this.translate.position.x--;
            this.rotate.rotation -= .1;
            this.scale.scaleX *= .9804;
        }
        if (pressedKeys.includes(keycodes.down)) {
            this.translate.position.y++;
            this.scale.scaleY *= 1.02;
        }
        if (pressedKeys.includes(keycodes.up)) {
            this.translate.position.y--;
            this.scale.scaleY *= .9804;
        }
        super.update(pressedKeys);
        this.root.update(pressedKeys);
    }

    draw(g) {
        g.clearRect(0, 0, this.width, this.height);
        super.draw(g);
        g.translate(this.x, this.y);
        this.root.draw(g);
        g.translate(this.x * -1, this.y * -1);
    }
}

var keycodes = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
};

/**
 * THIS IS THE BEGINNING OF THE PROGRAM
 * YOU NEED TO COPY THIS VERBATIM ANYTIME YOU CREATE A GAME
 */
function tick() {
    game.nextFrame();
}

/* Get the drawing canvas off of the  */
var drawingCanvas = document.getElementById('game');
if (drawingCanvas.getContext) {
    var game = new LabTwoGame(drawingCanvas);
    game.start();
}
