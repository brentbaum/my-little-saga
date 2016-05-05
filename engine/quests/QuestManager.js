"use strict";

var LawQuest = {name: "Master of the Old Law", 
		quote: "Hard things have happened here, both in loss of life and in lawsuits. (Njal’s saga, 274)",
		stages: ["Find Njal at Law Rock", 
			 "Learn the ways of the Old Law", 
			 "Use the Law to bring an Outlaw to justice!",
  			 "Quest Completed! You are now a Master of the Old Law"]};
var BerserkerQuest = {name: "I am become Bear", 
		      quote: "Odin's men rushed forwards without armour, were as mad as dogs or wolves, bit their shields, and were strong as bears or wild oxen, and killed people at a blow, but neither fire nor iron told upon them. This was called Berserkergang.",
		      bearsToKill: 5,
		      stages: ["Venture into the Berserker forest", 
			       "Defeat the Bears", "Go berserk on some poor outlaw", 
			       "Quest Complete! You can now go Berserk whenever you like."]};


class QuestManager {

    constructor(id) {
        this.toastManager = new ToastManager();
        this.actionManager = new ActionManager();
	this.actionManager.questManager = this;
	this.saga = Game.getInstance();
        if(this.saga.gameState.quests.current) {
            switch(this.saga.gameState.quests.current) {
                case "":
                break;
                case "law-rock":
                this.toastLawState();
                break;
                case "berserker":
                this.toastBerserkerState();
                break;
            }
        }
    }

    toastBerserkerState() {
	var state = this.saga.gameState.quests.berserkerState;
        var lines = [];
	lines.push(BerserkerQuest.stages[state.stage]);
	if (state.stage == 1) 
	    lines.push(state.bearsKilled + " out of " + BerserkerQuest.bearsToKill + " bears killed.");

	this.toastManager.updateQuestDisplay("Current Quest: " + BerserkerQuest.name,
					     lines);

    }

    toastLawState() {
	let state = this.saga.gameState.quests.lawState;
	var lines = [];
	lines.push(LawQuest.stages[state.stage]);
	this.toastManager.updateQuestDisplay("Current Quest: " + LawQuest.name,
					     lines);

    }

    registerBerserkerForestEntered() {
	var state = this.saga.gameState.quests.berserkerState;
        this.saga.gameState.quests.current = "berserker";
	if (state.stage === 0) {
	    this.saga.gameState.reputation += 10;
	    this.toastManager.updateHUD();
	    state.stage = 1;
	    this.toastBerserkerState();
	}
    }

    registerBearKilled() {
	var state = this.saga.gameState.quests.berserkerState;
        this.saga.gameState.quests.current = "berserker";
	console.log(state);
	if (state.stage == 1) {
	    state.bearsKilled++;
	    if (state.bearsKilled == BerserkerQuest.bearsToKill) {
		state.stage++;
		this.saga.gameState.reputation += 10;
		this.saga.gameState.actionsUnlocked.push("berserk");
		this.toastManager.updateHUD();
	    }
	    this.toastBerserkerState();
	}
    }

    registerOutlawKilledWithBerserk() {
	var state = this.saga.gameState.quests.berserkerState;
        this.saga.gameState.quests.current = "berserker";
	if (state.stage == 2) {
	    state.stage++;
	    this.saga.gameState.reputation += 10;
	    this.toastManager.updateHUD();
	    this.toastBerserkerState();
	}
    }

    
    registerLawRockEntered() {
	var state = this.saga.gameState.quests.lawState;
        this.saga.gameState.quests.current = "law-rock";
        this.saga.quest = "law-rock";
	if (state.stage === 0) {
	    state.stage++;
	    this.saga.gameState.reputation += 10;
            this.saga.gameState.quest = {id: "law-rock", stage: 1};
	    this.toastManager.updateHUD();
	}
	this.toastLawState();
    }

    registerNjalDialogue() {
	var state = this.saga.gameState.quests.lawState;
        this.saga.gameState.quests.current = "law-rock";
	if (state.stage == 1) {
	    state.stage++;
            this.saga.gameState.quest = {id: "law-rock", stage: 2};
	    this.saga.gameState.reputation += 10;
	    this.saga.gameState.actionsUnlocked.push("law");
	    this.toastManager.updateHUD();
	}
	this.toastLawState();
    }

    registerOutlawKilledWithLaw() {
	var state = this.saga.gameState.quests.lawState;
        this.saga.gameState.quests.current = "law-rock";
	if (state.stage == 2) {
	    state.stage++;
	    this.saga.gameState.reputation += 10;
	    this.toastManager.updateHUD();
	}
	this.toastLawState();
    }
}
