var flatDmg = function(x) { return () => x; };

var chantOneMove = {name: "chant", stateAddition: "chanting", message: "*the chanting intensifies*", damage: 0};
var chantTwoMove = {name: "chant", stateAddition: "chanting2", message: "*the chanting intensifies*", damage: 0};
var chantFinishMove = {name: "chant_conclude", message: "the wrath of the Gods is felt", damage: 1000};
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
	    moves: [chantOneMove,
		    chantTwoMove,
		    chantFinishMove]}
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
	this.opponent = {type: opponent, health: CombatOpponents[opponent].health};
	this.hero = hero;
	this.progress = 0;
	this.combatState = {hero: [], opponent: []};
	this.winner = null;
	this.selectedAction = 0;
	this.state = BATTLE_STATE_IP;
	this.actions = actions;
	console.log("battle", this);
    }

    selectMove(moves) {
	console.log("Selecting from moves: ", moves);
	let max = moves.length;
	var rand = function(min, max) {
	    return Math.random() * (max - min) + min;
	};

	let randomIndex = Math.round(rand(0, max));
	let selectedMove = moves[0];
	return selectedMove;
    }

    heroAction() {
	let selectedActionName = this.actions[this.selectedAction];
	let action = CombatActions[selectedActionName];

	if (false) {
	    console.log("Toast:" + action.activationMsg);
	}

	console.log(this.opponent.type);

	// Determine move for real based on combat state
	var move;
	if (selectedActionName === "magic") {
	    if (this.combatState.hero.includes("chanting") && action.name === "magic") {
		this.combatState.hero.remove("chanting");
		move = chantTwoMove;
	    } else if (this.combatState.hero.includes("chanting2")) {
		this.combatState.hero.remove("chanting2");
		move = chantFinishMove;
	    } else {
		// Draw a move at random
		move = chantOneMove;
	    }
	} else {
	    console.log("selecting random move");
	    move = this.selectMove(action.moves);
	}

	console.log(move);
	
	var damage = move.damage;
	var heal = move.heal;
	var message = this.hero.name + " " + move.message;

	let specialInteraction = CombatOpponents[this.opponent.type][selectedActionName];
	if (specialInteraction) {
	    message += ": " + specialInteraction.message;
	    damage *= specialInteraction.damage;
	}

	this.opponent.health -= damage;
	if (heal) this.hero.health += heal;

	if (move.stateAddition) {
	    this.combatState.hero.push(move.stateAddition);
	}

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
	
	console.log("opponent health", this.opponent.health);
	return {message: message, lines: lines, damage: damage, result: result};
    }

    opponentAction() {
	let move = this.selectMove(CombatOpponents[this.opponent.type].moves);
	var damage = move.damage;
	var heal = move.heal;

	this.hero.health -= damage;
	if (heal)
	    this.opponent.health += heal;

	var result;
	if (this.hero.health <= 0) {
	    result = "loss";
	} else if (this.opponent.health <= 0) {
	    result = "win"; 
	}

	var message = this.opponent.type + " " + move.message;

	// TODO Toast message + damage
	var lines = ["Dealt " + damage + " damage"];
	if (move.heal)
	    lines.push("Healed self for " + move.heal + " HP!");
	
	return {message: message, lines: lines, damage: damage, result: result};

    }
}
