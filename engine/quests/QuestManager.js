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
            } else if (event.params.second.id === "wall") {
                var mario = event.params.first;
                var wall = event.params.second;
                mario.jumpsRemaining = 2;
                if (event.params.direction === "left") {
                    mario.velocityX = Math.min(0, mario.velocityX);
                    mario.position.x = wall.position.x - mario.width * mario.scale.x;
                } else if (event.params.direction === "right") {
                    mario.velocityX = Math.max(.05, mario.velocityX);
                    mario.position.x = wall.position.x + wall.width * wall.scale.x + 5;
                } else if (event.params.direction === "top") {
                    mario.velocityY = Math.min(.05, mario.velocityY);
                    mario.position.y = wall.position.y + wall.height * wall.scale.y + 5;
                    mario.peaked = true;
                } else if (event.params.direction === "bottom") {
                    mario.velocityY = Math.min(0, mario.velocityY);
                    mario.position.y = wall.position.y - mario.height * mario.scale.y;
                }
            }
        }
        if (event.eventType === "coin-picked-up") {
            var snd = new Audio("resources/coin.wav"); // buffers automatically when created
            snd.play();
            event.source.removeEventListener(event.source, "coin-picked-up");
            console.log("something like \"quest is complete\"");
        }
    }
}
