var flatDmg = function(x) { return () => x; };

var chantMove = {name: "chant", message: "*the chanting intensifies*", damage: 0.0}
var CombatActions = {
    berserk: {activationMsg: "is going BEARserk",
	      moves: [{name: "Claw", message: "claws at the enemy", damage: 50, chance: 0.3},
		      {name: "Bite", message: "takes a bite out of the enemy", damage: 40, chance: 0.3},
		      {name: "Hibernate", message: "is hibernating", damage: 0, heal: 150, chance: 0.3},
		      {name: "Takedown", message: "performs a full takedown", damage: 200, chance: 0.2}]},
    law: {activationMsg: "has begun a lawsuit",
	  moves: [{message: "presents a list of grievances", damage: 0.3},
		  {message: "calls witnesses to testify", damage: 0.2}]},
    melee: {activationMsg: "put up his dukes",
	    moves: [{message: "throws a mean left hook", damage: 0.2},
		    {message: "throws his foe to the ground", damage: 0.5},
		    {message: "tears his foes' arms off", damage: 1.0}]},
    magic: {activationMsg: "has begun a terrifying chant",
	    moves: [chantMove,
		    {name: "chant_conclude", message: "the wrath of the Gods is felt", damage: 1.0}]}
};

// Hash for damage multipliers and unique messages
var CombatOpponents = {
    bear: {interactions: {law: {message: "Bear is immune to the Law!", damage: 0}},
	   health: 200,
	   moves: [{name: "Claw", message: "claws at you", damage: 20, chance: 0.5},
		   {name: "Bite", message: "takes a bite out of you", damage: 30, chance: 0.4},
		   {name: "Takedown", message: "performs a full takedown", damage: 100, chance: 0.1}]
	  }
};

var BATTLE_STATE_IP = "in_progress";
var BATTLE_STATE_COMPLETE = "complete";

class Battle {
    constructor(opponent, hero, actions) {
	this.opponent = opponent;
	this.hero = hero;
	this.progress = 0;
	this.comboState = {hero: [], opponent: []};
	this.winner = null;
	this.turn = 0;
	this.selectedAction = 0;
	this.state = BATTLE_STATE_IP;
	this.actions = actions;
    }

    selectMove(moves) {
	console.log("Selecting from moves: ", moves);
	let max = moves.length;
	var rand = function(min, max) {
	    return Math.random() * (max - min) + min;
	};

	let randomIndex = Math.round(rand(0, max));
	let selectedMove = moves[randomIndex];
	return selectedMove;
    }

    heroAction() {
	let selectedActionName = this.actions[this.selectedAction];
	let action = CombatActions[selectedActionName];

	// Draw a move at random

	// Determine move for real based on combo
	var move;
	if (this.comboState.hero.includes("chanting") && action.name === "magic") {
	    this.comboState.hero.remove("chanting");
	    this.comboState.hero.push("chanting2");
	    move
	} else if (this.comboState.hero.includes("chanting2") {

	    damage += 200;
	}
	let move = this.selectMove(action);
	
	var damage = move.damage;
	var heal = move.heal;
	var message = "";
	if (this.battle.turn === 0) {
	    // Toast activation message
	    console.log("Toast:" + action.activationMsg);
	}

	this.turn += 1;
	console.log(this.battle.opponent.type);
	let specialInteraction = CombatOpponents[this.battle.opponent.type][selectedActionName];
	if (specialInteraction) {
	    message += ": " + specialInteraction.message;
	    damage *= specialInteraction.damage;
	}

	this.opponent.health -= damage;
	this.hero.health += heal;


	var result;
	if (this.hero.health <= 0) {
	    result = "loss";
	} else if (this.opponent.health <= 0) {
	    result = "win"; 
	}

	// TODO Toast message + damage
	var lines = ["Dealt " + damage + " damage"];
	if (move.heal)
	    lines.push("Healed self for " + move.heal + " HP!");
	
	return {message: message, lines: lines, damage: damage, result: result};
    }

    opponentAction() {
	let action = CombatActions[selectedActionName];
	let move = this.selectMove(action);
	var damage = move.damage;
	var heal = move.heal;
	var message = "";
	if (this.battle.turn === 0) {
	    // Toast activation message
	    console.log("Toast:" + action.activationMsg);
	}

	this.turn += 1;
	console.log(this.battle.opponent.type);
	let specialInteraction = CombatOpponents[this.battle.opponent.type][selectedActionName];
	if (specialInteraction) {
	    message += ": " + specialInteraction.message;
	    damage *= specialInteraction.damage;
	}

	this.hero.health -= damage;
	this.hero.health += heal;

	var result;
	if (this.hero.health <= 0) {
	    result = "loss";
	} else if (this.opponent.health <= 0) {
	    result = "win"; 
	}


	// TODO Toast message + damage
	var lines = ["Dealt " + damage + " damage"];
	if (move.heal)
	    lines.push("Healed self for " + move.heal + " HP!");
	
	return {message: message, lines: lines, damage: damage, result: result};

    }

    performAction() {
	if (this.turn % 2 == 0) {
	    this.heroAction();
	} else {
	    this.opponentAction();
	}
    }

}
