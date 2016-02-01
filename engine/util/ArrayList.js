"use strict";

/**
 * A very basic arraylist for your convenience
 * 
 * */

Array.prototype.removeAt = function(index) {
    this.splice(index, 1);
    return this;
};

Array.prototype.print = function() {
    for (var i = 0; i < this.length; i++) {
        console.log(this[i] + ", ");
    }
};
Array.prototype.remove = function() {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
