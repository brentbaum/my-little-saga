"use strict";

/**
 * Main class. Instantiate or extend Game to create a new game of your own
 */
class Game{
    
    constructor(gameId, width, height, canvas){
        Game.instance = this;

        this.gameId = gameId;
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.g = canvas.getContext('2d'); //the graphics object
        this.playing = false;

        this.pressedKeys = [];

        /* Setup a key listener */
        window.addEventListener("keydown", onKeyDown, true);
        window.addEventListener("keyup", onKeyUp, true);
    }

    static getInstance(){ return Game.instance; }

    update(pressedKeys){}
    draw(g){}

    nextFrame(){
        game.update(this.pressedKeys);
        game.draw(this.g);
        if(this.playing) window.requestAnimationFrame(tick);
    }

    start(){
        this.playing = true;
        window.requestAnimationFrame(tick); //Notice that tick() MUST be defined somewhere! See LabOneGame.js for an example
    }

    pause(){
        this.playing = false;
    }


    /**
     * For dealing with keyCodes
     */
    addKey(keyCode){
        if(this.pressedKeys.indexOf(keyCode) == -1) this.pressedKeys.push(keyCode);
    }

    removeKey(keyCode){
        this.pressedKeys.remove(keyCode);
    }
}

function onKeyDown(e){ Game.getInstance().addKey(e.keyCode); }
function onKeyUp(e){ Game.getInstance().removeKey(e.keyCode); }
