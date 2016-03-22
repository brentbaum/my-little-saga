"use strict";

/**
 * Floor
 */

class Saga extends Game {
    constructor(canvas) {
        var size = {
            x: 600,
            y: 385
        };
        super("My Little Saga <3", size.x, size.y, canvas);
        this.size = size;
        this.centerPoint = {
            x: this.size.x / 2 - 15,
            y: this.size.y / 2 - 25
        };
        this.root = new DisplayObjectContainer("Root");
        this.setupMap(this.root);
        this.tweener = new TweenJuggler();
        this.toasts = new ToastManager();
        this.dispatcher = new EventDispatcher();
        this.questManager = new QuestManager();
        this.dispatcher.addEventListener(this.questManager, "collision");
        this.sound = new SoundManager();
    }

    setupMap(root) {
        var heroAnimations = {
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
        this.hero = new AnimatedSprite("hero", "super-mario-sprite.png", 21, heroAnimations);

        this.gravityAcc = -1;

        this.hero.animate("stop");
        this.hero.animationSpeed = 10;
        this.hero.position.x = this.centerPoint.x;
        this.hero.position.y = this.centerPoint.y;
        this.hero.scale = {
            x: .8,
            y: .5
        };

        this.floor = new DisplayObjectContainer("floor");
        this.floor.position.x = -50;
        this.floor.position.y = -50;
        var tileSize = 32;
        this.tileCount = {
            x: 25,
            y: 20
        };
        this.mapSize = {
            x: this.tileCount.x * tileSize,
            y: this.tileCount.y * tileSize
        };
        this.background = new DisplayObjectContainer("background");
        for (var x = 0; x < this.tileCount.x; x++) {
            for (var y = 0; y < this.tileCount.y; y++) {
                var tile = new Sprite("background-" + x + "-" + y, "grass.png");
                if (x === 0)
                    tile = new Sprite("background-" + x + "-" + y, "dirt-grass-right.png");
                if (x === this.tileCount.x - 1)
                    tile = new Sprite("background-" + x + "-" + y, "dirt-grass-left.png");
                if (y === 0)
                    tile = new Sprite("background-" + x + "-" + y, "dirt-grass-down.png");
                if (y === this.tileCount.y - 1)
                    tile = new Sprite("background-" + x + "-" + y, "dirt-grass-up.png");
                tile.position = {
                    x: x * 32,
                    y: y * 32
                };
                tile.collisionDisable = true;
                this.background.children.push(tile);
            }
        }
        this.foreground = new DisplayObjectContainer("foreground");
        this.background.collisionDisable = true;

        for (var x = 0; x < this.tileCount.x; x++) {
            for (var y = 0; y < this.tileCount.y; y++) {
                if (y === 3 && (Math.floor(x / 2) % 3 === 0)) {
                    var tile = new Sprite("foreground-" + x + "-" + y, "rock.png");
                    tile.position = {
                        x: x * 32,
                        y: y * 32
                    };

                    this.foreground.children.push(tile);
                }
            }
        }


        this.floor.children.push(this.background);
        this.floor.children.push(this.foreground);
        this.root.children = [this.floor, this.hero];

    }

    collideCheck(node, offset) {
        for (var child of node.children) {
            if (child.id === "hero")
                return;
            var dir = this.hero.collidesWith(child, offset);
            if (dir && !child.collisionDisable) {
                var event = new Event("collision", this.dispatcher, {
                    first: this.hero,
                    second: child,
                    direction: dir,
                    offset: offset
                });
                this.toasts.add("rock-collision",
                                "Collision!",
                                ["That's a nice rock you've got there.",
                                 "Can I have it?"], {duration: 2000});
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
                this.collideCheck(child, {
                    x: offset.x + node.position.x,
                    y: offset.y + node.position.y
                });
            }
        }
    }

    physic(root) {
        for (var child of root.children) {
            if (!!child.children) {
                this.physic(child);
            }
        }
    }

    move(pressedKeys) {
        var movementSpeed = 1.5;
        if (pressedKeys.includes(keycodes.right)) {
            this.hero.animate("run");

            //move
            if (this.mapSize.x + this.floor.position.x > this.size.x && Math.abs(this.hero.position.x - this.centerPoint.x) < 2 * movementSpeed)
                this.floor.position.x -= movementSpeed;
            else if (this.hero.position.x < this.size.x)
                this.hero.position.x += movementSpeed;
        }
        if (pressedKeys.includes(keycodes.left)) {
            this.hero.animate("run");

            //move
            if (this.floor.position.x < -1.5 && Math.abs(this.hero.position.x - this.centerPoint.x) < 2 * movementSpeed)
                this.floor.position.x += movementSpeed;
            else if (this.hero.position.x > 0) {
                this.hero.position.x -= movementSpeed;
            }
        }
        if (pressedKeys.includes(keycodes.down)) {
            this.hero.animate("run");
            if (this.mapSize.y + this.floor.position.y > this.size.y && Math.abs(this.hero.position.y - this.centerPoint.y) < 2 * movementSpeed)
                this.floor.position.y -= movementSpeed;
            else if (this.hero.position.y < this.size.y)
                this.hero.position.y += movementSpeed;
        }
        if (pressedKeys.includes(keycodes.up)) {
            this.hero.animate("run");
            if (this.floor.position.y < -1.5 && Math.abs(this.hero.position.y - this.centerPoint.y) < 2 * movementSpeed)
                this.floor.position.y += movementSpeed;
            else if (this.hero.position.y > 0) {
                this.hero.position.y -= movementSpeed;
            }
        }

        if (pressedKeys.length === 0) {
            //stop and do nothing, all is futile.
            this.hero.animate("stop");
        }
    }

    update(pressedKeys) {
        this.tweener.nextFrame();
        this.physic(this.root);
        this.collideCheck(this.root, {
            x: 0,
            y: 0
        });
        this.move(pressedKeys);
        this.root.updatePositions();
        this.toasts.update();
        super.update(pressedKeys);
        this.root.update(pressedKeys);
    }

    draw(g) {
        g.clearRect(0, 0, this.width, this.height);
        super.draw(g);
        this.root.draw(g);
        this.toasts.draw(g);
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
    var game = new Saga(drawingCanvas);
    game.start();
}
