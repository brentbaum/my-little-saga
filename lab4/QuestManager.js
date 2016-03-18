"use strict";

class QuestManager extends EventListener {
    constructor(id) {
        super(id);
    }
    handleEvent(event) {
        if(event.eventType === "collision") {
            if(event.params.first.id === "mario" && event.params.second.id === "coin") {
                event.source.dispatchEvent("coin-picked-up");
            }
        }
        if(event.eventType === "coin-picked-up") {
            console.log("something like \"quest is complete\"");
        }
    }
}
