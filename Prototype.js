"use strict";

var dev_inventory = [{
    id: "rock",
    name: "Rock",
    description: "For smashing",
    count: 3
}, {
    id: "tree",
    name: "Tree",
    description: "For building",
    count: 3
}];
var dev_game_state = {
    actionsUnlocked: ["berserk", "law", "melee", "magic"],
    inBattle: false,
    gameOver: false,
    inventory: []
};
var game_size = {
    x: 970,
    y: 650
};

var GameObjects = {
    hero: {
        name: "hero",
        filename: "super-mario-sprite.png"
    },
    rock: {
        name: "rock",
        filename: "fg/rock.png"
    },
    grass: {
        name: "grass",
        filename: "bg/grass.png"
    },
    water: {
        name: "water",
        filename: "bg/water.png"
    },
    sand: {
        name: "sand",
        filename: "bg/sand.png"
    },
    bear: {
        name: "bear",
        filename: "fg/bear.png"
    }
};

class Saga extends Game {
    constructor(canvas) {
        var size = game_size;
        super("My Little Saga <3", size.x, size.y, canvas);
        this.size = size;
        this.centerPoint = {
            x: this.size.x / 2,
            y: this.size.y / 2
        };
        this.tileSize = 64;
        this.tileCount = {
            x: 25,
            y: 20
        };
        this.mapSize = {
            x: this.tileCount.x * this.tileSize,
            y: this.tileCount.y * this.tileSize
        };
        this.root = new DisplayObjectContainer("Root");
        this.inBattle = false;
        this.tweener = new TweenJuggler();
        this.toastManager = new ToastManager();
        this.dispatcher = new EventDispatcher();
        this.questManager = new QuestManager();
        this.combatManager = new CombatManager();
        this.inventoryManager = new InventoryManager();
        this.actionManager = new ActionManager();
        this.dispatcher.addEventListener(this.actionManager, "proximity-collision");
        this.addActions();
        this.sound = new SoundManager();

        this.setupHero();

        this.gameState = dev_game_state;
        // this.gameState = {actionsUnlocked: [], reputation: 0};

        //var mapGenerator = new MapGenerator();
        //var map = mapGenerator.generate(this.tileCount);
        var mapReader = new MapReader();
        var tileReader = new TileMappingReader();
        var saga = this;
        this.tileMapping = {};
        var t = this;
        tileReader.get(function(mapping) {
            mapping.list.forEach(function(tile) {
                t.tileMapping[tile.key] = tile.img;
            });
            mapReader.get('berserkerforest', function(map) {
                saga.setupMap(saga.root, map);
            });
        });

	// TODO just for testing:
	this.questManager.registerBerserkerForestEntered();
    }

    setupHero(root) {
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
        this.hero = new AnimatedSprite("hero", "hero", 21, heroAnimations);
        this.hero.name = "Ragnar";

        this.hero.animate("stop");
        this.hero.animationSpeed = 10;
        this.hero.position.x = this.centerPoint.x;
        this.hero.position.y = this.centerPoint.y;
        this.hero.scale = {
            x: .8,
            y: .5
        };

        this.floor = new DisplayObjectContainer("floor");
        this.background = new DisplayObjectContainer("background");
        this.foreground = new DisplayObjectContainer("foreground");
    }

    setupMap(root, map) {

        this.floor.position.x = -50;
        this.floor.position.y = -50;

        for (var y = 0; y < this.tileCount.y; y++) {
            var row = [];
            for (var x = 0; x < this.tileCount.x; x++) {
                var bgTile = new Sprite("bg_(" + x + ", " + y + ")", map.background[x][y]);
                var fgTile = new Sprite(map.foreground[x][y] + "_(" + x + ", " + y + ")", map.foreground[x][y]);
                bgTile.position = {
                    x: x * this.tileSize,
                    y: y * this.tileSize
                };
                fgTile.position = {
                    x: x * this.tileSize,
                    y: y * this.tileSize
                };
                bgTile.collisionDisable = true;
		if (bgTile.type === "water" || bgTile.type === "rock") {
		    bgTile.collisionDisable = false;
		}
                this.background.children.push(bgTile);
                this.foreground.children.push(fgTile);
            }
        }

        // this.background.collisionDisable = true;
        this.floor.children.push(this.background);
        this.floor.children.push(this.foreground);
        this.root.children = [this.floor, this.hero];
    }

    addActions() {
        this.actionManager.add("stone-hit", (object) => {
            object.visible = false;
            object.collisionDisable = true;
        });
        this.actionManager.add("bear-fight", (bear) => {
            this.combatManager.beginBattle(bear, this.hero, this.gameState.actionsUnlocked, null);
            this.inBattle = true;
        });
    }

    concludeBattle(result, opponent) {
        this.inBattle = false;
        console.log("[Saga] Conclude battle: " + result);
        if (result === "win") {
            this.toastManager.updateActionPrompt("You defeated the " + opponent.type + "!", ["Gained 3 reputation"]);

	    // Quest Stuff!
	    if (opponent.type == "bear") {
		this.questManager.registerBearKilled();
	    }
        } else {
            // TODO handle loss
	    var stats = {};
	    this.gameOver(stats);
        }
	var stats = {};
	this.gameOver(stats);

        // TODO delete sprite
        opponent.visible = false;
        opponent.collisionDisable = true;
    }

    gameOver(stats) {
	this.toastManager.updateCenterDisplay("Game over! :(", ["here are some stats", stats]);
	this.gameState.gameOver = true;
    }

    collideCheck(node, offset) {
        for (var child of node.children) {
            if (child.id === "hero")
                return;
            if (!child.collisionDisable) {
                var dir = this.hero.collidesWith(child, offset);
                if (dir) {
                    var event;
                    if (dir === "proximity") {
                        event = new Event("proximity-collision", this.dispatcher, {
                            first: this.hero,
                            second: child,
                            direction: dir,
                            offset: offset
                        });
                    } else {
                        event = new Event("collision", this.dispatcher, {
                            first: this.hero,
                            second: child,
                            floor: this.floor,
                            direction: dir,
                            offset: offset
                        });
                        switch (dir) {
                        case "left":
                            if (this.isCentered("left")) {
                                this.floor.position.x += 1.5;
                            } else {
                                this.hero.position.x -= 1.5;
                            }
                            break;
                        case "right":
                            if (this.isCentered("right")) {
                                this.floor.position.x -= 1.5;
                            } else {
                                this.hero.position.x += 1.5;
                            }
                            break;
                        case "top":
                            if (this.isCentered("up")) {
                                this.floor.position.y -= 1.5;
                            } else {
                                this.hero.position.y += 1.5;
                            }
                            break;
                        case "bottom":
                            if (this.isCentered("down")) {
                                this.floor.position.y += 1.5;

                            } else {
                                this.hero.position.y -= 1.5;
                            }
                            break;
                        }
                    }
                    this.dispatcher.dispatchEvent(event);
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

    isCentered(dir) {
        var movementSpeed = 1.5;

        if (dir === "right")
            return this.mapSize.x + this.floor.position.x > this.size.x && Math.abs(this.hero.position.x - this.centerPoint.x) < 8 * movementSpeed;
        if (dir === "left")
            return this.floor.position.x < -movementSpeed * 2 && Math.abs(this.hero.position.x - this.centerPoint.x) < 8 * movementSpeed;
        if (dir === "up")
            return this.mapSize.y + this.floor.position.y > this.size.y && Math.abs(this.hero.position.y - this.centerPoint.y) < 8 * movementSpeed;
        if (dir === "down")
            return this.floor.position.y < -movementSpeed && Math.abs(this.hero.position.y - this.centerPoint.y) < 8 * movementSpeed;
    }

    move(pressedKeys, newKeys) {
        var movementSpeed = 1.5;
        if (pressedKeys.includes(keycodes.right)) {
            this.hero.animate("run");

            //move
            if (this.isCentered("right"))
                this.floor.position.x -= movementSpeed;
            else if (this.hero.position.x < this.size.x)
                this.hero.position.x += movementSpeed;
        }
        if (pressedKeys.includes(keycodes.left)) {
            this.hero.animate("run");

            //move
            if (this.isCentered("left"))
                this.floor.position.x += movementSpeed;
            else if (this.hero.position.x > 0) {
                this.hero.position.x -= movementSpeed;
            }
        }
        if (pressedKeys.includes(keycodes.down)) {
            this.hero.animate("run");
            if (this.isCentered("up"))
                this.floor.position.y -= movementSpeed;
            else if (this.hero.position.y < this.size.y)
                this.hero.position.y += movementSpeed;
        }
        if (pressedKeys.includes(keycodes.up)) {
            this.hero.animate("run");
            if (this.isCentered("down"))
                this.floor.position.y += movementSpeed;
            else if (this.hero.position.y > 0) {
                this.hero.position.y -= movementSpeed;
            }
        }

        if (newKeys.includes(keycodes.i)) {
            this.inventoryManager.open(dev_inventory);
        }

        if (pressedKeys.includes(keycodes.space)) {
            this.actionManager.act();
        }

        if (pressedKeys.length === 0) {
            //stop and do nothing, all is futile.
            this.hero.animate("stop");
        }
    }

    pressedKeyDiff(pressedKeys) {
        if (!this.lastPressed)
            this.lastPressed = [];
        var t = this;
        var newKeys = pressedKeys.filter(function(k1) {
            return !t.lastPressed.some(function(k2) {
                return k1 === k2;
            });
        });
        this.lastPressed = pressedKeys.slice(0);
        return newKeys;
    }

    update(pressedKeys) {
        var newKeys = this.pressedKeyDiff(pressedKeys);
        this.actionManager.clear();
        this.tweener.nextFrame();
        this.collideCheck(this.root, {
            x: 0,
            y: 0
        });
        if (this.inBattle) {
            this.combatManager.update(newKeys);
        } else if (this.inInventory) {
            this.inventoryManager.update(newKeys);
        } else {
            this.move(pressedKeys, newKeys);
        }
        this.root.updatePositions();
        this.toastManager.update();
        super.update(pressedKeys);
        this.root.update(pressedKeys);
    }

    draw(g) {
        g.clearRect(0, 0, this.width, this.height);
        super.draw(g);
        this.root.draw(g);
        this.actionManager.draw(g, this.floor.position);
        this.toastManager.draw(g);
    }
}

var keycodes = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    m: 77,
    z: 90,
    i: 73,
    space: 32
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
