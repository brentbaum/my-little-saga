"use strict";

var dev_inventory = [{
    id: "rock",
    name: "Rock",
    description: "For smashing",
    count: 0
}, {
    id: "tree",
    name: "Tree",
    description: "For building",
    count: 1
}];
var dev_game_state = {
    actionsUnlocked: [
        // "berserk", 
        // "law", 
        "melee", "magic"
    ],
    map: "start",
    hidden: {},
    health: 500,
    hero: {
        x: 320,
        y: 468
    },
    floor: {
        x: 0,
        y: -300
    },
    quests: {
        current: undefined,
        lawState: {stage: 0},
        swimState: {stage: 0},
        magicState: {stage: 0},
        berserkerState: {stage: 0, bearsKilled: 0}
    },
    inBattle: false,
    gameOver: false,
    fires: 3,
    reputation: 0,
    inventory: dev_inventory
};
var game_size = {
    x: 970,
    y: 640
};

var GameObjects = {
    hero: {
        key: "hero",
        img: "hero/hero.png"
    }
};

var playerName = "";

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
        this.screenTileSize = {
            x: game_size.x / this.tileSize,
            y: game_size.y / this.tileSize
        };
        this.tileCount = {
            x: 20,
            y: 15
        };
        this.mapSize = {
            x: this.tileCount.x * this.tileSize,
            y: this.tileCount.y * this.tileSize
        };

        this.initNewGameButton();

        /************ LOAD SAVED STATE **************/
        var saved = localStorage.getItem("game-state"); 
        if(saved && JSON.parse(saved)) {
            this.gameState = JSON.parse(saved);
        }
        else {
            this.gameState = dev_game_state;
            playerName = prompt("Hail, and welcome to Iceland. What shall we call you?");
            this.gameState.playerName = playerName;
        }
        /************ /LOAD SAVED STATE **************/

        this.movementSpeed = 4;
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
        this.atHome = true;
        this.sound = new SoundManager();

        // this.gameState = {actionsUnlocked: [], reputation: 0};

        //var mapGenerator = new MapGenerator();
        //var map = mapGenerator.generate(this.tileCount);
        this.mapReader = new MapReader();
        var tileReader = new TileMappingReader();
        var saga = this;
        var t = this;
        tileReader.get(function(mapping) {
            mapping.list.forEach(function(tile) {
                GameObjects[tile.key] = tile;
            });
            t.setupHero();
            t.mapReader.get(t.gameState.map, function(map) {
                saga.setupMap(saga.root, map);
                t.setup = true;
            });
        });
    }

    initNewGameButton() {
        var t = this;
        document.getElementById("clear").addEventListener("click", function(){
            localStorage.clear();
            location.reload();
        });
        document.getElementById("save").addEventListener("click", function(){
            t.gameState.floor = t.floor.position;
            t.gameState.hero = t.hero.position;
            var state = JSON.stringify(t.gameState);
            localStorage.setItem("game-state", state);
            alert("Game saved!");
        });
    }

    setupHero(root) {
        var heroAnimations = {
	    "stop": {
		start: 0,
		end: 0
	    },
            "down": {
                start: 0,
                end: 3
            },
            "left": {
                start: 4,
                end: 10 
            },
	    "right": {
		start: 11,
		end: 17
	    },
	    "up": {
		start: 18,
		end: 21
	    }
        };
        //instantiate with the id, filename, number of frames, and the animation map.
        this.hero = new AnimatedSprite("hero", "hero", 8, heroAnimations, HeroSheet);
        this.hero.name = this.gameState.playerName;

        this.hero.scale = {
            x: 0.42,
            y: 0.42 
        };

        this.hero.animate("stop");
        this.hero.animationSpeed = 5;
        this.hero.position.x = this.gameState.hero.x;
        this.hero.position.y = this.gameState.hero.y;

        this.hero.maxhealth = 500;
        this.hero.health = this.gameState.health;
        this.toastManager.updateHUD();
    }

    setupMap(root, map) {
        this.floor = new DisplayObjectContainer("floor");

        this.floor.position.x = this.gameState.floor.x;
        this.floor.position.y = this.gameState.floor.y;

        this.tileCount = {
            x: map.background.length,
            y: map.background[0].length
        };
        this.mapSize = {
            x: this.tileCount.y * this.tileSize,
            y: this.tileCount.x * this.tileSize
        };

        this.background = new DisplayObjectContainer("background");
        this.foreground = new DisplayObjectContainer("foreground");
        for (var x = 0; x < this.tileCount.x; x++) {
            var row = [];
            for (var y = 0; y < this.tileCount.y; y++) {
                var bgTile = new Sprite("bg_(" + x + ", " + y + ")", map.background[x][y]);
                var fgId = map.foreground[x][y] + "_(" + x + ", " + y + ")"; 
                var fgTile = new Sprite(fgId, map.foreground[x][y]);
                bgTile.position = {
                    y: x * this.tileSize,
                    x: y * this.tileSize
                };
                bgTile.tilePosition = {
                    y: x,
                    x: y
                };
                fgTile.position = {
                    y: x * this.tileSize,
                    x: y * this.tileSize
                };
                fgTile.tilePosition = {
                    y: x,
                    x: y
                };
                bgTile.collisionDisable = true;
                if (bgTile.type === "water" || bgTile.type === "rock") {
                    bgTile.collisionDisable = false;
                }
                if (bgTile.type === "teleport") {
                    bgTile.collisionDisable = false;
                    bgTile.softCollide = false;
                }
                if(this.gameState.hidden[fgId]) {
                    fgTile.visible = false;
                    fgTile.collisionDisable = true;
                }

                this.background.children.push(bgTile);
                this.foreground.children.push(fgTile);
            }
        }

        // this.background.collisionDisable = true;
        this.floor.children = [this.background, this.foreground];
        this.floor.children.push(this.background);
        this.floor.children.push(this.foreground);
        this.root.children = [this.floor, this.hero, this.toastManager];
    }

    addActions() {
        this.actionManager.add("rock-hit", (object) => {
            object.visible = false;
            object.collisionDisable = true;
            // TODO hardcoded index for beta
            if (this.gameState.inventory[0].count === 0)
                this.gameState.actionsUnlocked.push("rock");
            this.gameState.inventory[0].count++;
            this.gameState.reputation++;
            this.gameState.hidden[object.id] = true;
	    this.toastManager.updateHUD();
        });
	this.actionManager.add("campfire", (campfire) => {
	    if (this.gameState.fires > 0) {
		this.hero.health += 200;
                this.gameState.health = this.hero.health;
		this.gameState.fires--;
		this.toastManager.updateHUD();
	    }
	});
        this.actionManager.add("bear-fight", (bear) => {
            this.combatManager.beginBattle(bear, this.hero, this.gameState.actionsUnlocked, null);
            this.inBattle = true;
        });
        this.actionManager.add("outlaw-fight", (outlaw) => {
            this.combatManager.beginBattle(outlaw, this.hero, this.gameState.actionsUnlocked, null);
            this.inBattle = true;
        });
        this.actionManager.add("njal-dialogue", (njal) => {
            this.questManager.registerNjalDialogue();
        });

        var t = this;
        this.actionManager.add("teleport", (carpet, params) => {
            t.mapReader.get(params.level, function(map) {
                t.gameState.map = params.level;
		t.setupMap(t.root, map);
		t.setPosition(params.position);
                // t.hero.position = params.position;
		t.atHome = !t.atHome;
            });
        });
    }

    concludeBattle(results, opponent) {
        this.inBattle = false;
        console.log("[Saga] Conclude battle: " + results);
        if (results.result === "win") {
            this.toastManager.updateActionPrompt("You defeated the " + opponent.type + "!", ["Gained 5 reputation"]);
	    this.gameState.reputation += 5;
	    this.toastManager.updateHUD();

            this.gameState.hidden[opponent.id] = true;
            this.gameState.health = this.hero.health;

            // Quest Stuff!
            if (opponent.type == "bear") {
                this.questManager.registerBearKilled();
            }
            if (opponent.type == "outlaw") {
                console.log("Winning action: ", results.action);
                if (results.action === "berserk")
                    this.questManager.registerOutlawKilledWithBerserk();
                if (results.action === "law")
                    this.questManager.registerOutlawKilledWithLaw();
            }
        } else {
            // TODO handle loss
            var stats = {};
            this.gameOver(stats);
        }
        // TODO delete sprite
        opponent.visible = false;
        opponent.collisionDisable = true;
    }

    gameOver(stats) {
        this.toastManager.updateCenterDisplay("Game over! :(", []);
        this.gameState.gameOver = true;
    }

    onScreen(floor, tileSize, screenTileSize) {
        return function(node) {
            if (node.id === "hero")
                return true;
            if (!node.tilePosition)
                return false;
            var top = {
                x: Math.floor(floor.position.x * -1 / tileSize) - 1,
                y: Math.floor(floor.position.y * -1 / tileSize) - 1
            };

            var bottom = {
                x: top.x + screenTileSize.x + 2,
                y: top.y + screenTileSize.y + 2
            };

            return top.x < node.tilePosition.x && top.y < node.tilePosition.y && bottom.x > node.tilePosition.x && bottom.y > node.tilePosition.y;

        };
    }

    setPosition(coords) {
	console.log("Set position", coords);
        if (!this.floor)
            return;
        var position = {
            x: coords.x * this.tileSize,
            y: coords.y * this.tileSize
        };
        this.floor.position = {
            x: -position.x + game_size.x / 2,
            y: -position.y + game_size.y / 2
        };
        this.hero.position = {
            x: this.centerPoint.x,
            y: this.centerPoint.y
        };
    }

    collideCheck(node, offset) {
        if (this.inBattle)
            return;

        for (var child of node.children) {
            if (child.id === "hero")
                return;
            if (!child.collisionDisable && this.onScreen(this.floor, this.tileSize, this.screenTileSize)(child)) {
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
                        if (!child.softCollide) {
                            switch (dir) {
                            case "left":
                                if (this.isCentered("left")) {
                                    this.floor.position.x += this.movementSpeed;
                                } else {
                                    this.hero.position.x -= this.movementSpeed;
                                }
                                break;
                            case "right":
                                if (this.isCentered("right")) {
                                    this.floor.position.x -= this.movementSpeed;
                                } else {
                                    this.hero.position.x += this.movementSpeed;
                                }
                                break;
                            case "top":
                                if (this.isCentered("up")) {
                                    this.floor.position.y -= this.movementSpeed;
                                } else {
                                    this.hero.position.y += this.movementSpeed;
                                }
                                break;
                            case "bottom":
                                if (this.isCentered("down")) {
                                    this.floor.position.y += this.movementSpeed;

                                } else {
                                    this.hero.position.y -= this.movementSpeed;
                                }
                                break;
                            }
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
        if (dir === "right")
            return -1 * this.floor.position.x > this.movementSpeed
            && this.hero.position.x < this.centerPoint.x + 2 * this.movementSpeed;
        if (dir === "left")
            return this.mapSize.x + this.floor.position.x - 2 * this.centerPoint.x > 2 * this.movementSpeed
            && this.hero.position.x > this.centerPoint.x - 2 * this.movementSpeed;
        if (dir === "down")
            return -1 * this.floor.position.y > this.movementSpeed
            && this.hero.position.y < this.centerPoint.y + 2 * this.movementSpeed;
        if (dir === "up") {
            return this.mapSize.y + this.floor.position.y - 2 * this.centerPoint.y > 2 * this.movementSpeed
                && this.hero.position.y > this.centerPoint.y - 2 * this.movementSpeed;
        }
        return false;
    }

    move(pressedKeys, newKeys) {
	var animatedAlready = false; // Animate once per frame
        if (pressedKeys.includes(keycodes.right)) {
	    this.hero.animate("right");
	    animatedAlready = true;

            //move
            if (this.isCentered("left"))
                this.floor.position.x -= this.movementSpeed;
            else if (this.hero.position.x < this.size.x)
                this.hero.position.x += this.movementSpeed;
        }
        if (pressedKeys.includes(keycodes.left)) {
	    this.hero.animate("left");
	    animatedAlready = true;

            //move
            if (this.isCentered("right"))
                this.floor.position.x += this.movementSpeed;
            else if (this.hero.position.x > 0) {
                this.hero.position.x -= this.movementSpeed;
            }
        }
        if (pressedKeys.includes(keycodes.down)) {
	    if (!animatedAlready) this.hero.animate("down");

            if (this.isCentered("up"))
                this.floor.position.y -= this.movementSpeed;
            else if (this.hero.position.y < this.size.y)
                this.hero.position.y += this.movementSpeed;
        }
        if (pressedKeys.includes(keycodes.up)) {
	    if (!animatedAlready) this.hero.animate("up");
            if (this.isCentered("down"))
                this.floor.position.y += this.movementSpeed;
            else if (this.hero.position.y > 0) {
                this.hero.position.y -= this.movementSpeed;
            }
        }

        if (newKeys.includes(keycodes.i)) {
            this.inventoryManager.open(this.gameState.inventory);
        }

        if (newKeys.includes(keycodes.space)) {
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
        if (!this.setup)
            return;
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
            if (!this.gameState.gameOver)
                this.move(pressedKeys, newKeys);
        }
        this.root.updatePositions();
        this.toastManager.update();
        super.update(pressedKeys);
        this.root.update(pressedKeys);
    }

    draw(g) {
        if (!this.setup)
            return;
        g.clearRect(0, 0, this.width, this.height);
        g.fillStyle = "rgb(0, 0, 0)";
        g.fillRect(0, 0, this.width, this.height);
        super.draw(g);
        this.root.draw(g, this.onScreen(this.floor, this.tileSize, this.screenTileSize));
        if (this.floor) {
            this.actionManager.draw(g, this.floor.position);
        }
        // this.toastManager.draw(g);
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
