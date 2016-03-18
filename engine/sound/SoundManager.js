"use strict";

class SoundManager {
    constructor() {
        this.effects = {};
        this.music = {};
    }

    loadSoundEffect(id, filename) {
        this.effects[id] = new Audio("resources/" + filename);
    }

    playSoundEffect(id) {
        var effect = this.effects[id];
        if (!!effect) {
            effect.play();
            if(!effect.paused || effect.currentTime)
                effect.currentTime = 0;
        }
    }

    loadMusic(id, filename) {
        this.music[id] = new Audio("resources/" + filename);
    }

    playMusic(id) {
        var song = this.music[id];
        if (!!song) {
            song.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);
            song.play();
        }
    }
    stopMusic(id) {
        var song = this.music[id];
        if(!!song) {
            song.pause();
        }
    }
    musicPlaying(id) {
        var song = this.music[id];
        return !song.paused;
    }
}
