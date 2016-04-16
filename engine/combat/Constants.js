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

