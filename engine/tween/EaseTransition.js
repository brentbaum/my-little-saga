"use strict";

class EaseTransition extends TweenTransition {
    
    scale(t) {
        return this.start + t * t * (this.end - this.start);
    }
    
}
