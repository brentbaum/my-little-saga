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

    beginBattle(opponent, hero, actions, scene) {
	// this.updateBattleMenu();
	console.log("[CombatManager]: Begin battle");
	this.phase = "prompt";
	this.opponent = opponent;
	this.active = true;
	this.battle = new Battle(opponent.type, hero, actions);
	this.turn = true;
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
	let results = this.battle.heroAction();

	this.updateCombatMessage(results.message, results.lines);
	
	if (results.result === "win" || results.result === "loss") {
	    this.concludeBattle(results.result);
	} else {
	    this.turn = false;
	    this.goToPrompt();
	}
    }

    concludeBattle(result) {
	let saga = Game.getInstance();
	this.active = false;
	this.toastManager.hide("combat_menu");
	this.toastManager.hide("combat_message");
	this.battle = {};
	saga.concludeBattle(result, this.opponent);
    }

    updateBattleMenu() {
	let x = game_size.x / 2;
	let y = game_size.y / 2;
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
    }

    goToPrompt() {
	this.phase = "prompt";
	this.toastManager.hide("combat_menu");
	this.toastManager.show("combat_message");
    }

    doEnemyMove() {
	this.toastManager.hide("combat_menu");
	let result = this.battle.opponentAction();
	this.updateCombatMessage(result.message, result.lines);
	this.turn = true;
    }

    backToBattle() {
	console.log("back to battle");
	this.phase = "action";
	this.updateBattleUI();
	this.toastManager.show("combat_menu");
	this.toastManager.hide("combat_message");
    }

    update(pressedKeys) {
	if (!this.active)
	    return;
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
		if (this.turn) {
		    this.backToBattle();
		} else {
		    this.doEnemyMove();
		}
	    }
	}
    }

}
