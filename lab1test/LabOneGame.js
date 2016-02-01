"use strict";

/**
 * Main class. Instantiate or extend Game to create a new game of your own
 */
class LabOneGame extends Game {
    constructor(canvas) {
        var size = {
            x: 800,
            y: 500
        };
        super("Lab One Game", size.x, size.y, canvas);
        this.size = size;
        this.mario = new Sprite("Mario", "Mario.png");
        this.x = 0;
        this.y = 0;
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
        this.mario.update(pressedKeys);
    }

    draw(g) {
        g.clearRect(0, 0, this.width, this.height);
        super.draw(g);
        g.translate(this.x, this.y);
        this.mario.draw(g);
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
    var game = new LabOneGame(drawingCanvas);
    game.start();
}
