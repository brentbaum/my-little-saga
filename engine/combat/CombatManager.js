"use strict";

let combatInstance = null;


// Sax - a kind of short, heavy sword or sabre, with only one sharp edge
var INPUT_BUF_SIZE = 10;
var playerName = "Ragnar";

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

    beginBattle(opponent, heroHealth, actions, scene) {
	// this.updateBattleMenu();
	this.phase = "prompt";
	this.battle = new Battle(opponent, heroHealth, actions);
	this.updateCombatMessage("Prepare to Battle!", [playerName + " is battling " + opponent.type]);
    }


    updateCombatMessage(title, lines) {
	lines.push("<SPC>");
	this.toastManager.putToggle("combat_message", title, lines, ToastManager.top_middle());
    }

    disableBattleMenu() {
	this.toastManager.hide("combat_menu");
    }

    performAction() {
	if (this.battle.turn === 0) {
	    // Toast activation message
	    // console.log("Toast:" + action.activationMsg);
	}
	let results = this.battle.performAction();

	this.updateCombatMessage(playerName + " " + results.message, results.lines);
	
	if (results.result === "win") {
	    this.concludeBattle("win");
	}
	if (results.result === "loss") {
	    this.concludeBattle("loss"); 
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
