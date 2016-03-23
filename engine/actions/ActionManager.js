"use strict";

let actionInstance = null;

class ActionManager {
    constructor() {
        if(!actionInstance) {
            actionInstance = this;
        }
        this.actionable = null;
        this.actions = {};

        return actionInstance;
    }

    add(k, fn) {
        this.actions[k] = fn;
    }

    focus(displayObject, dist, k, params) {
        if(!this.actionable || dist < this.actionable.dist) {
            this.actionable = {object: displayObject,
                               dist: dist,
                               params,
                               k: k || displayObject.actionKey};
        }
    }

    act() {
        if(!this.actionable)
            return;
        var fn = this.actions[this.actionable.k];
        if(fn)
            fn(this.actionable.object, this.actionable.params);
    }

    clear() {
        this.actionable = null;
    }
}
