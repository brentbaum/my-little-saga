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
                    hero.velocityX = Math.min(0, hero.velocityX);
                    hero.position.x = wall.position.x - hero.width * hero.scale.x;
                } else if (event.params.direction === "right") {
                    hero.velocityX = Math.max(.05, hero.velocityX);
                    hero.position.x = wall.position.x + wall.width * wall.scale.x + 5;
                } else if (event.params.direction === "top") {
                    hero.velocityY = Math.min(.05, hero.velocityY);
                    hero.position.y = wall.position.y + wall.height * wall.scale.y + 5;
                    hero.peaked = true;
                } else if (event.params.direction === "bottom") {
                    hero.velocityY = Math.min(0, hero.velocityY);
                    hero.position.y = wall.position.y - hero.height * hero.scale.y;
                }
            }
        }
    }
}
