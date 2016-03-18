"use strict";

let instance = null;

class TweenJuggler{  
    constructor() {
        if(!instance){
              instance = this;
        }

        this.tweens = [];

        return instance;
      }

    add(object, transitionType, duration, param, end, endCB) {
        var transition;
        var start = object[param];
        if(transitionType === 'linear')
            transition = new LinearTransition(param, start, end, duration);
        if(transitionType === 'ease')
            transition = new EaseTransition(param, start, end, duration);
        var tween = new Tween(object, transition, endCB);
        this.tweens.push(tween);
    }

    nextFrame() {
        var completed = this.tweens.filter(t => t.progress >= 1);
        for(var tween of completed) {
            tween.object[tween.transition.param] = tween.transition.end;
            if(tween.endCB)
                tween.endCB();
        }
        this.tweens = this.tweens.filter(t => t.progress < 1);
        for(var tween of this.tweens) {
            tween.update();
        }
    }
}
