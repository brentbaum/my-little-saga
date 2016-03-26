"use strict";

let actionInstance = null;

class ActionManager {
    constructor() {
        if (!actionInstance) {
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
        console.log(dist);
        if (!this.actionable || dist > this.actionable.dist) {
            this.actionable = {
                object: displayObject,
                dist: dist,
                params,
                k: k || displayObject.actionKey
            };
        }
    }

    act() {
        if (!this.actionable)
            return;
        var fn = this.actions[this.actionable.k];
        if (fn)
            fn(this.actionable.object, this.actionable.params);
    }

    clear() {
        this.actionable = null;
    }

    draw(g, offset) {
        if(!this.actionable)
            return;
        var start = {
            x: offset.x + this.actionable.object.position.x + this.actionable.object.width * .5 - 10,
            y: offset.y + this.actionable.object.position.y - 10
        };
        drawSelector(g, start);
    }
}

function drawSelector(ctx, start) {
    // Draw triangle
    ctx.fillStyle = "#A2322E";
    ctx.beginPath();
    // Draw a triangle location for each corner from x:y 100,110 -> 200,10 -> 300,110 (it will return to first point)
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(start.x + 20, start.y);
    ctx.lineTo(start.x + 10, start.y + 10);
    ctx.closePath();
    ctx.fill();
}
