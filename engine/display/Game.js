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
        this.fps = 60;

        this.pressedKeys = [];

        var mc = document.createElement('canvas');
        mc.width = game_size.x;
        mc.height = game_size.y;
        this.mg = mc.getContext('2d');
        this.mc = mc;

        /* Setup a key listener */
        window.addEventListener("keydown", onKeyDown, true);
        window.addEventListener("keyup", onKeyUp, true);
    }

    static getInstance(){ return Game.instance; }

    update(pressedKeys){}
    draw(g){}

    nextFrame(){
        //console.log("--------");
        var startTime = (new Date()).getTime();
        game.update(this.pressedKeys);
        var updateTime = (new Date()).getTime() - startTime;
        game.draw(this.mg);
        this.g.drawImage(this.mc, 0, 0);
        var endTime = (new Date()).getTime();
        var i = 1000 / this.fps;
        //console.log(endTime - startTime, " = ", updateTime, " + ", endTime - startTime - updateTime);
       // console.log("--------");
        var remainder = i - (endTime - startTime) % i;
        if(this.playing) {
            setTimeout(function() {
                window.requestAnimationFrame(tick);
            }, remainder);
        }
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
