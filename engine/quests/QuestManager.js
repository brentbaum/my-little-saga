"use strict";

class QuestManager extends EventListener {
    constructor(id) {
        super(id);
    }
    handleEvent(event) {
        if (event.eventType === "collision") {
            if (event.params.first.id === "mario" && event.params.second.id === "coin") {
                var pickedUpEvent = new Event("coin-picked-up", event.source);
                event.source.dispatchEvent(pickedUpEvent);
            } else {
                var hero = event.params.first;
                var wall = event.params.second;
                if (event.params.direction === "left") {
                    hero.position.x = wall.position.x - hero.width * hero.scale.x;
                } else if (event.params.direction === "right") {
                    hero.position.x = wall.position.x + wall.width * wall.scale.x + 1.5;
                } else if (event.params.direction === "top") {
                    hero.position.y = wall.position.y + wall.height * wall.scale.y + 1.5;
                } else if (event.params.direction === "bottom") {
                    hero.position.y = wall.position.y - hero.height * hero.scale.y;
                }
            }
        }
    }
}
