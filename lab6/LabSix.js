"use strict";

/**
 * Floor
 */
class LabSixGame extends Game {
    constructor(canvas) {
        var size = {
            x: 600,
            y: 385
        };
        super("Lab Hive Game", size.x, size.y, canvas);
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

        this.gravityAcc = -1;

        this.mario.speed = 10;
        this.mario.animate("run");
        this.mario.physics.gravity = true;
        this.mario.jumpsRemaining = 2;
        this.mario.position.x = 50;
        this.mario.position.y = 150;
        this.coin = new AnimatedSprite("coin", "coin.png", 6, coinAnimations);
        this.coin.position.x = 500;
        this.coin.position.y = 100;
        this.coin.animate("rotate");

        this.coinPlatform = new Sprite("wall", "platform.png");
        this.coinPlatform.position.x = 400;
        this.coinPlatform.position.y = 150;
        this.coinPlatform.scale = {
            x: .2,
            y: .2
        };

        this.floor = new Sprite("wall", "platform.png");
        this.floor.position.x = 20;
        this.floor.position.y = 250;
        this.floor.scale = {
            x: .2,
            y: .2
        };

        this.background = new Sprite("background", "background.png");
        this.background.physics.collisionDisable = true;

        this.root = new DisplayObjectContainer("Root");
        this.root.children = [this.background, this.mario, this.coin, this.floor, this.coinPlatform];

        this.sound = new SoundManager();
        this.sound.loadSoundEffect("jump", "jump.wav");
        this.sound.loadSoundEffect("coin", "coin.wav");
        //this.sound.loadMusic("theme", "theme.mp3");
        //this.sound.playMusic("theme");

        this.tweener = new TweenJuggler();
        this.mario.scaleX = 0;
        this.tweener.add(this.mario, 'ease', 3000, 'scaleX', 1);

        this.dispatcher = new EventDispatcher();
        this.questManager = new QuestManager();
        this.dispatcher.addEventListener(this.questManager, "coin-picked-up");
        this.dispatcher.addEventListener(this.questManager, "collision");
    }

    physic(root) {
        for (var child of root.children) {
            if (child.physics.gravity) {
                child.velocityY = child.velocityY - this.gravityAcc;
            }
            if (!!child.children) {
                this.physic(child);
            }
        }
    }

    collideCheck(node) {
        for (var child of node.children) {
            var dir = this.mario.collidesWith(child);
            if (dir && !child.collisionDisable) {
                var event = new Event("collision", this.dispatcher, {
                    first: this.mario,
                    second: child,
                    direction: dir
                });
                this.dispatcher.dispatchEvent(event);
                if (child.id === "coin" && !this.complete) {
                    this.complete = true;
                    this.sound.playSoundEffect("coin");
                    this.tweener.add(this.coin, 'ease', 1000, 'scaleX', 4, () => {
                        this.tweener.add(this.coin, 'linear', 500, 'alpha', 0);
                    });
                    this.tweener.add(this.coin, 'ease', 1000, 'scaleY', 4);
                    this.tweener.add(this.coin, 'ease', 1000, 'posX', 230);
                    this.tweener.add(this.coin, 'ease', 1000, 'posY', 150);
                }
            }

            if (child.children) {
                this.collideCheck(child);
            }
        }
    }

    move(pressedKeys) {
        if (pressedKeys.includes(keycodes.right)) {
            this.mario.velocityX = this.mario.velocityX + .4;
            this.mario.animate("run");
        }
        if (pressedKeys.includes(keycodes.left)) {
            this.mario.velocityX = this.mario.velocityX - .4;
            this.mario.animate("run");
        }
        if (pressedKeys.includes(keycodes.down)) {
            //do nothing, all is futile.
        }

        if (pressedKeys.includes(keycodes.up)) {
            console.log(this.mario.jumpsRemaining);
            if(!this.mario.jumping && this.mario.jumpsRemaining > 0) {
                this.sound.playSoundEffect("jump");
                this.mario.jumping = true;
                this.mario.jumpStart = this.mario.position.y;
                this.mario.jumpsRemaining -= 1;
                this.mario.velocityY = -5;
            }
            if(this.mario.jumping) {
                if(this.mario.jumpStart - 100 > this.mario.position.y) {
                    this.mario.peaked = true;
                }
                else if(!this.mario.peaked) {
                    this.mario.velocityY = this.mario.velocityY - 5;
                }
            }
        }
        else {
            this.mario.jumping = false;
            this.mario.peaked = false;
        }

        if(pressedKeys.includes(keycodes.m)) {
            if(!this.mDown) {
                this.mDown = true;
                if(this.sound.musicPlaying("theme"))
                    this.sound.stopMusic("theme");
                else
                    this.sound.playMusic("theme");
            }
        }

        if (pressedKeys.length === 0) {
            this.mDown = false;
            this.mario.animate("stop");
            if(this.mario.velocityY === 0) {
                if(Math.abs(this.mario.velocityX) < .25) {
                    this.mario.velocityX = 0;
                } else {
                    this.mario.velocityX = Math.sign(this.mario.velocityX) * (Math.abs(this.mario.velocityX) - .25);
                }
            }
        }
    }

    update(pressedKeys) {
        this.tweener.nextFrame();
        this.physic(this.root);
        this.collideCheck(this.root);
        this.move(pressedKeys);
        this.root.updatePositions();
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
    down: 40,
    m: 77
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
    var game = new LabSixGame(drawingCanvas);
    game.start();
}
