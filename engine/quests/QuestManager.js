"use strict";

var LawQuest = {name: "Master of the Old Law", quote: "Hard things have happened here, both in loss of life and in lawsuits. (Njal’s saga, 274)",
		stages: ["Find Njal at Law Rock", "Learn the ways of the Old Law", "Win a settlement"]};
var BerserkerQuest = {name: "I am become Bear", quote: "Odin's men rushed forwards without armour, were as mad as dogs or wolves, bit their shields, and were strong as bears or wild oxen, and killed people at a blow, but neither fire nor iron told upon them. This was called Berserkergang.",
		      bearsToKill: 5,
		      stages: ["Venture into the Berserker forest", "Defeat the Bears", "Go berserk on some poor outlaw"]};


class QuestManager {

    constructor(id) {
        this.toastManager = new ToastManager();
        this.actionManager = new ActionManager();
	this.berserkerState = {stage: 0, bearsKilled: 0};
	this.lawState = 0;
	this.swimState = 0;
	this.magicState = 0;
    }


    toastBerserkerState() {
	let state = this.berserkerState;
	var lines = [];
	lines.push(BerserkerQuest.stages[state.stage]);
	if (state.stage == 1) 
	    lines.push(state.bearsKilled + " out of " + BerserkerQuest.bearsToKill + " bears killed.");

	this.toastManager.updateQuestDisplay("Current Quest: " + BerserkerQuest.name,
					     lines);
    }

    registerBerserkerForestEntered() {
	var state = this.berserkerState;
	if (state.stage === 0) {
	    state.stage = 1;
	    this.toastBerserkerState();
	}
    }

    registerBearKilled() {
	var state = this.berserkerState;
	console.log(state);
	if (state.stage == 1) {
	    state.bearsKilled++;
	    if (state.bearsKilled == BerserkerQuest.bearsToKill) {
		state.stage++;
	    }
	    this.toastBerserkerState();
	}
    }

    registerOutlawKilledWithBerserk() {
	var state = this.berserkerState;
	if (this.berserkerState.stage == 2) {
	    state.stage++;
	    this.toastBerserkerState();
	}
    }
}
