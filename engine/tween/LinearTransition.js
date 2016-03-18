"use strict";

class LinearTransition extends TweenTransition {
    
    scale(t) {
        return this.start + t * (this.end - this.start);
    }
    
}
