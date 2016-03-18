"use strict";

/**
 * Floor
 */
class LabFourGame extends Game {
    constructor(canvas) {
        var size = {
            x: 800,
            y: 500
        };
        super("Lab Floor Game", size.x, size.y, canvas);
        this.size = size;
        var coinAnimations = {
            "stop": {
                start: 0,
                end: 0
            },
            "rotate": {
                start: 0,
                end: 5
            }
        };
        var marioAnimations = {
            "stop": {
                start: 0,
                end: 0
            },
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
        this.mario = new AnimatedSprite("mario", "super-mario-sprite.png", 21, marioAnimations);
        this.mario.speed = 10;
        this.mario.animate("run");
        this.coin = new AnimatedSprite("coin", "coin.png", 6, coinAnimations);
        this.coin.position.x = 500;
        this.coin.position.y = 100;
        this.coin.animate("rotate");

        this.root = new DisplayObjectContainer("Root");
        this.root.children = [this.mario, this.coin];

        this.dispatcher = new EventDispatcher();
        this.questManager = new QuestManager();
        this.dispatcher.addEventListener(this.questManager, "coin-picked-up");
    }

    update(pressedKeys) {
        if (pressedKeys.includes(keycodes.right)) {
            this.mario.position.x += 2;
            this.mario.animate("run");
        }
        if (pressedKeys.includes(keycodes.left)) {
            this.mario.position.x -= 2;
            this.mario.animate("run");
        }
        if (pressedKeys.includes(keycodes.down)) {
            this.mario.position.y += 2;
        }
        if (pressedKeys.includes(keycodes.up)) {
            this.mario.position.y -= 2;
        }
        if(pressedKeys.length === 0) {
            this.mario.animate("stop");
        }
        if(!this.complete && this.mario.position.x > 480 && this.mario.position.x < 510
          && this.mario.position.y > 40 && this.mario.position.y < 130) {
            var event = new Event("coin-picked-up", this.dispatcher);
            this.dispatcher.dispatchEvent(event);
            this.coin.visible = false;
            this.complete = true;
        }
        super.update(pressedKeys);
        this.root.update(pressedKeys);
    }

    draw(g) {
        g.clearRect(0, 0, this.width, this.height);
        super.draw(g);
        this.root.draw(g);
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
    var game = new LabFourGame(drawingCanvas);
    game.start();
}
