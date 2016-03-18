"use strict";

class Tween {
    constructor(object, transition, endCB) {
        this.object = object;
        this.start = (new Date()).getTime();
        this.transition = transition;
        this.endCB = endCB;
    }

    get progress() {
        var t = ((new Date()).getTime() - this.start);
        return t / this.transition.duration;
    }

    update() {
        var t = this.progress;
        this.object[this.transition.param] = this.transition.scale(t);
    }
}
