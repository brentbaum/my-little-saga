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
            }
        }
        // TODO here
        if (event.eventType === "proximity-collision") {
            let params = event.params;
            if (params.second.type === "rock") {
                this.toasts.put("proximity-context", "...", ["You stare at the rock.", "The rock stares back.", "<SPC>"], {
                    duration: 300
                });
                var dist = params.first.distanceFrom(params.second);
                this.actions.focus(params.second, dist, "stone-hit");
            } else if (params.second.type === "bear") {
                this.toasts.put("proximity-context", "...", ["Yeah. Big ass-bear.", "Fight him?", "<SPC>"], {
                    duration: 300
                });
                var dist = params.first.distanceFrom(params.second);
                this.actions.focus(params.second, dist, "bear-fight");
            }
        }
    }
}
