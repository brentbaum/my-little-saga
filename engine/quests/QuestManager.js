"use strict";

class QuestManager extends EventListener {
    constructor(id) {
        super(id);
        this.toasts = new ToastManager();
        this.actions = new ActionManager();
    }
    handleEvent(event) {
        if (event.eventType === "collision") {
            if (event.params.first.id === "hero" && event.params.second.id === "coin") {
                var pickedUpEvent = new Event("coin-picked-up", event.source);
                event.source.dispatchEvent(pickedUpEvent);
            } else {
                var hero = event.params.first;
                var wall = event.params.second;
                var offset = event.params.offset;
                if (event.params.direction === "left") {
                    hero.position.x = offset.x + wall.position.x - hero.width * hero.scale.x;
                } else if (event.params.direction === "right") {
                    hero.position.x = offset.x + wall.position.x + wall.width * wall.scale.x + 1.5;
                } else if (event.params.direction === "top") {
                    hero.position.y = offset.y + wall.position.y + wall.height * wall.scale.y + 1.5;
                } else if (event.params.direction === "bottom") {
                    hero.position.y = offset.y + wall.position.y - hero.height * hero.scale.y;
                }
            }
        }
        if (event.eventType === "proximity-collision") {
            this.toasts.add("rock-collision",
                "...", ["You stare at the rock.", "The rock stares back."
                ], {
                    duration: 300
                });
            var dist = event.params.first.distanceFrom(event.params.second);
            this.actions.focus(event.params.second, dist, "stone-hit");
        }
    }
}
