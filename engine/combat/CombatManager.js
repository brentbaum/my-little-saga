"use strict";

let combatInstance = null;


// Sax - a kind of short, heavy sword or sabre, with only one sharp edge
var BATTLE_STATE_IP = "in_progress";
var BATTLE_STATE_COMPLETE = "complete";
var INPUT_BUF_SIZE = 10;
var playerName = "Ragnar";

var combatActions = {
    berserk: {activationMsg: "is going BEARserk",
	      moves: [{name: "Claw", message: "claws at the enemy", damage: 0.2},
		      {name: "Hibernate", message: "is hibernating", damage: 0.1},
		      {name: "Takedown", message: "performs a full takedown", damage: 0.2}]},
    law: {activationMsg: "has begun a lawsuit",
	  moves: [{message: "presents a list of grievances", damage: 0.3},
		  {message: "calls witnesses to testify", damage: 0.2}]},
    melee: {activationMsg: "put up his dukes",
	    moves: [{message: "throws a mean left hook", damage: 0.2},
		    {message: "throws his foe to the ground", damage: 0.5},
		    {message: "tears his foes' arms off", damage: 1.0}]},
    magic: {activationMsg: "has begun a terrifying chant",
	    moves: [{message: "*the chanting intensifies*", damage: 0.0},
		    {message: "the wrath of the Gods is felt", damage: 1.0}]}
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

	this.toastManager = new ToastManager();
	this.phase = "prompt"; // || "action"

	combatInstance = this;
	this.inputBuffer = 0;
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
	return playerName + action;
    }

    beginBattle(opponent, actions, scene) {
	this.battle = {opponent: opponent,
		       progress: 0,
		       winner: null,
		       turn: 0,
		       selectedAction: 0,
		       state: BATTLE_STATE_IP,
		       actions: actions};
	// this.updateBattleMenu();
	this.phase = "prompt";
	this.updateCombatMessage("Prepare to Battle!", [playerName + " is battling " + opponent.type]);
    }

    updateCombatMessage(title, lines) {
	lines.push("<SPC>");
	this.toastManager.putToggle("combat_message", title, lines, ToastManager.top_middle());
    }

    selectMove(action) {
	console.log("action", action);
	let max = action.length;
	let randomIndex = 0;
	let selectedMove = action.moves[randomIndex];
	return selectedMove;
    }

    disableBattleMenu() {
	this.toastManager.hide("combat_menu");
    }

    performAction() {

	let selectedActionName = this.battle.actions[this.battle.selectedAction];
	let action = combatActions[selectedActionName];
	let move = this.selectMove(action);
	var damage = move.damage;
	if (this.battle.turn === 0) {
	    // Toast activation message
	    console.log("Toast:" + action.activationMsg);
	}

	var message = playerName + " " + move.message;

	this.battle.turn += 1;
	console.log(this.battle.opponent.type);
	let specialInteraction = combatOpponents[this.battle.opponent.type][selectedActionName];
	if (specialInteraction) {
	    message += ": " + specialInteraction.message;
	    damage *= specialInteraction.damage;
	}
	this.battle.progress += damage;

	// TODO Toast message + damage
	this.updateCombatMessage(message, ["Dealt " + damage + " damage"]);
	
	if (this.battle.progress >= 1.0) {
	    this.concludeBattle();
	} else {
	    this.goToPrompt();
	}
    }

    concludeBattle() {
	var config = ToastManager.top_right();
	config.duration = 5000;
	this.toastManager.put("proximity-context", 
			      "You defeated the " + this.battle.opponent.type + "!", 
			      ["Gained 3 reputation"],
			      config);
	let saga = Game.getInstance();
	saga.inBattle = false;
	this.inputBuffer = 0;
	this.battle.opponent.visible = false;
	this.battle.opponent.collisionDisable = true;
	this.toastManager.hide("combat_menu");
	this.toastManager.hide("combat_message");
	this.battle = {};
    }

    updateBattleMenu() {
	let x = game_size.x / 2;
	let y = game_size.y / 2;
	console.log(x, y);
	console.log(this.battle);
	var actionLines = [];
	for (var i = 0; i < this.battle.actions.length; i++) {
	    actionLines[i] = (i == this.battle.selectedAction) ? ">> " + this.battle.actions[i] : this.battle.actions[i];
	}
	var config = ToastManager.bottom_left();
	config.titleSize = 16;
	this.toastManager.putToggle("combat_menu", "Choose Action <SPC>", actionLines, config);
    }

    updateBattleUI() {
	this.updateBattleMenu();
	// TODO toast progress
	console.log(this.battle.progress);
    }

    goToPrompt() {
	this.phase = "prompt";
	this.toastManager.hide("combat_menu");
	this.toastManager.show("combat_message");
    }

    backToBattle() {
	this.phase = "action";
	this.updateBattleUI();
	this.toastManager.show("combat_menu");
	this.toastManager.hide("combat_message");
    }

    update(pressedKeys) {
	if (this.inputBuffer++ < INPUT_BUF_SIZE) {
	    return;
	}

	if (this.phase === "action") {
	    if (pressedKeys.includes(keycodes.up)) {
		if (this.battle.selectedAction > 0) {
		    this.battle.selectedAction -= 1;
		    this.updateBattleUI();
		    this.inputBuffer = 0;
		}
	    }
	    if (pressedKeys.includes(keycodes.down)) {
		if (this.battle.selectedAction < this.battle.actions.length - 1) {
		    this.battle.selectedAction += 1;
		    this.updateBattleUI();
		    this.inputBuffer = 0;
		}
	    }
	    if (pressedKeys.includes(keycodes.space)) {
		this.performAction();
		this.inputBuffer = 0;
	    }

	} else if (this.phase === "prompt") {
	    if (pressedKeys.includes(keycodes.space)) {
		this.inputBuffer = 0;
		this.backToBattle();
	    }
	}
	
	
    }

}
