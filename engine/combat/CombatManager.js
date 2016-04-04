"use strict";

let combatInstance = null;


// Sax - a kind of short, heavy sword or sabre, with only one sharp edge
var BATTLE_STATE_IP = "in_progress";
var BATTLE_STATE_COMPLETE = "complete";
var playerName = "Ragnar";

var keycodes = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    m: 77,
    z: 90,
    space: 1
};

var combatActions = {
    berserk: {activationMsg: "is going BEARserk",
	      moves: [{name: "Claw", message: "claws at the enemy", damage: 0.2},
		      {name: "Hibernate", message: "is hibernating", damage: 0.1},
		      {name: "Takedown", message: "performs a full takedown", damage: 0.2}]},
    law: {activationMsg: "has begun a lawsuit",
	  moves: ["presents a list of grievances", "calls witnesses to testify"]},
    melee: {activationMsg: "put up his dukes",
	    moves: ["throws a mean left hook", "throws his foe to the ground", "tears his foes' arms off"]},
    weapon: {activationMsg: "pulls a giant axe out of his... hat",
	     moves: ["weapon 1", "weapon 2"]},
    magic: {activationMsg: "has begun a terrifying chant",
	    moves: ["the chanting intensifies", "chanting intensifies x2"]}
};

// Hash for damage multipliers and unique messages
var combatOpponents = {
    bear: {law: {message: "Bear is immune to the Law!", damage: 0}}
};

class CombatManager {

    /* combat TODOs:
     * - Barebones V1
     * - Healthbars
     * - Sounds
     * - Animations
     * Maybe Law is a way to avoid battle instead of a combat mode
     */

    constructor() {
	if(combatInstance) {
	    return combatInstance;
	}

	var canvas = document.getElementById('game');
	this.g = canvas.getContext('2d'); //the graphics object

	combatInstance = this;
	return this;
    }

    static initialTextForAction(action) {
	switch (action) {
	case "berserk": return "activates Bear Form!";
	case "law": return "has begun a lawsuit!";    
	case "melee": return "put up his dukes!";
	case "weapon": return "brandishes his dagger!";
	case "magic": return "has begun a terrifying cultic chant!";
	}
    }

    getMenuText(actions, index) {
	var s = "";
	var i = 0;
	for (var si of this.battle.actions) {
	    s += "\n";
	    if (i++ == this.battle.index) s += "> ";
	    s += si;
	}
	return s;
    }

    getMessageText() {
	var action = " activated Bear Form!";
    }

    beginBattle(opponent, actions, scene) {
	this.battle = {opponent: opponent,
		       progress: 0,
		       winner: null,
		       turn: 0,
		       selectedAction: 0,
		       state: BATTLE_STATE_IP,
		       actions: actions};
    }

    selectMove(action) {
	let max = action.length;
	let randomIndex = 0;
	let selectedMove = action.moves[randomIndex];
	return selectedMove;
    }

    performAction() {
	let action = this.battle.selectedAction;
	let move = this.selectMove(action);
	var damage = action.damage;
	if (this.battle.turn === 0) {
	    // Toast activation message
	    console.log("Toast:" + action.activationMessage);
	}

	var message = playerName + " " + move.message + ": ";

	this.battle.turn += 1;
	this.battle.selectedAction = 0;
	let specialInteraction = this.battle.opponents[this.battle.opponent][action];
	if (specialInteraction) {
	    message += specialInteraction.message;
	    damage *= specialInteraction.damage;
	}
	this.battle.progress += damage;

	// TODO Toast message + damage
	console.log(message + "\n" + damage);
    }

    update(pressedKeys) {
	if (pressedKeys.includes(keycodes.up)) {
	    if (this.battle.selectedAction > 0)
		this.battle.selectedAction -= 1;
	}
	if (pressedKeys.includes(keycodes.down)) {
	    if (this.battle.selectedAction < this.battle.actions.length - 1)
		this.battle.selectedAction += 1;
	}
	if (pressedKeys.includes(keycodes.space)) {
	    this.performAction();
	}
    }

}
