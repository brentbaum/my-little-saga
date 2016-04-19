"use strict";

class QuestManager extends EventListener {
    constructor(id) {
        super(id);
        this.toasts = new ToastManager();
        this.actions = new ActionManager();
    }
    handleEvent(event) {
        if (event.eventType === "proximity-collision") {
            let params = event.params;
            if (params.second.type === "rock") {
		this.toasts.updateActionPrompt("...", ["You stare at the rock.", "The rock stares back.", "<SPC>"]);
                var dist = params.first.distanceFrom(params.second);
                this.actions.focus(params.second, dist, "stone-hit");
            } else if (params.second.type === "bear") {
                this.toasts.updateActionPrompt("...", ["Yeah. Big ass-bear.", "Fight him?", "<SPC>"]);
                var dist = params.first.distanceFrom(params.second);
                this.actions.focus(params.second, dist, "bear-fight");
            }
        }
    }
}
