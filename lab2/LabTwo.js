"use strict";

/**
 * Main class. Instantiate or extend Game to create a new game of your own
 */
class LabTwoGame extends Game {
    constructor(canvas) {
        var size = {
            x: 800,
            y: 500
        };
        super("Lab Two Game", size.x, size.y, canvas);
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
        animated.animate("run");
        this.sprites = [animated, new Sprite("Mario2", "Mario.png")];
        this.sprites[1].position = {
            x: 400,
            y: 0
        };
        this.sprites[1].rotation = .5;
        this.sprites[1].pivotPoint = {
            x: 0,
            y: 0
        };
        this.sprites[0].alpha = .5;
        console.log(this.sprites);
    }

    update(pressedKeys) {
        if (pressedKeys.includes(keycodes.right) && this.x < this.size.x - 150)
            this.x++;
        if (pressedKeys.includes(keycodes.left) && this.x > 0)
            this.x--;
        if (pressedKeys.includes(keycodes.down) && this.y < this.size.y - 150)
            this.y++;
        if (pressedKeys.includes(keycodes.up) && this.y > 0)
            this.y--;
        super.update(pressedKeys);
        this.sprites[1].rotation += .01;
        for (var x = 0; x < this.sprites.length; x++) {
            this.sprites[x].update(pressedKeys);
        }
    }

    draw(g) {
        g.clearRect(0, 0, this.width, this.height);
        super.draw(g);
        g.translate(this.x, this.y);
        for (var x = 0; x < this.sprites.length; x++) {
            this.sprites[x].draw(g);
        }
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
