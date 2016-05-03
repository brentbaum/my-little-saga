"use strict";

let actionInstance = null;

class ActionManager extends EventListener {
    constructor() {
	super("actionMan");
        if (!actionInstance) {
            actionInstance = this;
        }
	this.toasts = new ToastManager();
        this.actionable = null;
        this.actions = {};

        return actionInstance;
    }

    handleEvent(event) {
	let atHome = Game.getInstance().atHome;
	
        if (event.eventType === "proximity-collision") {
            let params = event.params;
            var dist = params.first.distanceFrom(params.second);
            if (params.second.type === "rock") {
		this.toasts.updateActionPrompt("...", ["You stare at the rock.", "The rock stares back.", "<SPC>"]);
                this.focus(params.second, dist, "rock-hit");
            } else if (params.second.type === "bear") {

                this.toasts.updateActionPrompt("...", ["Yeah. Big ass-bear.", "Fight him?", "<SPC>"]);
                this.focus(params.second, dist, "bear-fight");

            } else if (params.second.type === "njal") {

                this.toasts.updateActionPrompt("It is Njal the Wise!", ["Will you learn the ways of the Law from him?", 
									"<SPC>"]);
                this.focus(params.second, dist, "njal-dialogue");

            } else if (params.second.type === "teleport_forest") {

		if (atHome) this.transportAction("berserkerforest", "Berserker Forest", params.second, dist, 3, 10);
                else        this.homeTransportAction(params.second, dist); 

            } else if (params.second.type === "teleport_ocean") {

		if (atHome) this.transportAction("ocean", "lake floor", params.second, dist, 17, 1);
                else        this.homeTransportAction(params.second, dist); 

            } else if (params.second.type === "teleport_lawrock") {

		if (atHome) {
		    this.questManager.registerLawRockEntered();
		    this.transportAction("lawrock", "Law Rock", params.second, dist, 1, 12);
		}
                else        this.homeTransportAction(params.second, dist); 

            } else if (params.second.type === "outlaw") {

		this.toasts.updateActionPrompt("An outlaw! Only one of us is going home alive.", []);
                this.focus(params.second, dist, "outlaw-fight");

	    }
        }
    }

    homeTransportAction(target, dist) {
	this.transportAction("start", "camp", target, dist, target.tilePosition.x, target.tilePosition.y);
    }

    transportAction(level, name, target, dist, x, y) {
	let saga = Game.getInstance();
	let position = {x: saga.tileSize*x, y: saga.tileSize*y};

	this.toasts.updateActionPrompt("This will take you to the " + name + ".", ["Go? <SPC>"]);
        this.focus(target, dist, "teleport", {level: level, position: position});
    }

    add(k, fn) {
        this.actions[k] = fn;
    }

    focus(displayObject, dist, k, params) {
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
	if (!this.actionable) {
	    return;
	}
	var fn = this.actions[this.actionable.k];
	if (fn) {
	    fn(this.actionable.object, this.actionable.params);
	    this.toasts.hide("proximity-context");
	}
    }

    clear() {
	this.toasts.hide("proximity-context");
	this.actionable = null;
    }

    draw(g, offset) {
	if(!this.actionable) {
	    return;
	}
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
