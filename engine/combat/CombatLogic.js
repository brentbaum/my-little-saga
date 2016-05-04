var flatDmg = function(x) { return () => x; };

var chantOneMove = {name: "chant", stateAddition: "chanting", message: "began to chant a spooky chant", damage: 0};
var chantTwoMove = {name: "chant", stateAddition: "chanting2", message: "continues to chant a spooky chant", damage: 0};
var chantFinishMove = {name: "chant_conclude", message: "concludes his chant", damage: 1000};
var rockThrowMove = {name: "rock_throw", message: "heaves a boulder at the enemy!", damage: 100};
var CombatActions = {
    berserk: {activationMsg: "is going BEARserk",
	      moves: [{name: "Claw", message: "claws at the enemy", damage: 50},
		      {name: "Bite", message: "takes a bite out of the enemy", damage: 40},
		      {name: "Hibernate", message: "is hibernating", damage: 0, heal: 150},
		      {name: "Takedown", message: "performs a full takedown", damage: 200}]},
    law: {activationMsg: "has begun a lawsuit",
	  moves: [{message: "presents a list of grievances", damage: 100},
		  {message: "calls witnesses to testify", damage: 60}]},
    melee: {activationMsg: "put up his dukes",
	    moves: [{message: "throws a mean left hook", damage: 20},
		    {message: "throws his foe to the ground", damage: 30},
		    {message: "tears his foes' arms off", damage: 300}]},
    magic: {activationMsg: "has begun a terrifying chant",
	    moves: [chantOneMove, chantTwoMove, chantFinishMove]},
    rock: {activationMsg: "", moves: [rockThrowMove]}
};

// Hash for damage multipliers and unique messages
var CombatOpponents = {
    bear: {interactions: {law: {message: "Bear is immune to the Law!", damage: 0}},
	   health: 300,
	   moves: [{name: "Claw", message: "claws at you", damage: 20},
		   {name: "Bite", message: "takes a bite out of you", damage: 30},
		   {name: "Takedown", message: "performs a full takedown", damage: 60}]
	  },
    outlaw: {interactions: {law: {message: "The outlaw is guilty!", damage: 2}},
	     health: 200,
	     moves: [{name: "Beard-whip", message: "whips you with his beard", damage: 10},
		     {name: "Dagger slice", message: "slices with his dagger", damage: 30}]
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

	let randomIndex = max > 0 ? Math.round(rand(0, max-1)) : 0;
	// let selectedMove = moves[randomIndex];
	let selectedMove = moves[randomIndex];
	return selectedMove;
    }

    heroAction() {
	let selectedActionName = this.actions[this.selectedAction];
	let action = CombatActions[selectedActionName];
	console.log(selectedActionName);
	var lines = [];

	if (false) { console.log("Toast:" + action.activationMsg); }

	console.log(this.opponent.type);

	// Determine move for real based on combat state
	var move;
	console.log("this.combatState.hero", this.combatState.hero);
	if (selectedActionName === "magic") {
	    if (this.combatState.hero.indexOf("chanting2") != -1) {
		this.combatState.hero.splice(this.combatState.hero.indexOf("chanting2"), 1);
		lines.push("The wrath of the gods is felt!");
		move = chantFinishMove;
	    } else if (this.combatState.hero.indexOf("chanting") != -1) {
		this.combatState.hero.splice(this.combatState.hero.indexOf("chanting"), 1);
		move = chantTwoMove;
	    } else {
		move = chantOneMove;
	    }
	} else {
	    // Draw a move at random
	    console.log("selecting random move");
	    move = this.selectMove(action.moves);
	}
	console.log("this.combatState.hero", this.combatState.hero);
	console.log(move);
	
	var damage = move.damage;
	var heal = move.heal;
	var message = this.hero.name + " " + move.message;

	let specialInteraction = CombatOpponents[this.opponent.type].interactions[selectedActionName];
	if (specialInteraction) {
	    lines.push(specialInteraction.message);
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
	lines.push("Dealt " + damage + " damage");
	if (move.heal)
	    lines.push("Healed self for " + move.heal + " HP!");
	
	console.log("opponent health", this.opponent.health);
	return {message: message, lines: lines, damage: damage, result: result, action: selectedActionName};
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
