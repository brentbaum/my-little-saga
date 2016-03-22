"use strict";

let toastInstance = null;

class ToastManager {
    constructor() {
        if(!toastInstance) {
            toastInstance = this;
        }
        var canvas = document.getElementById('game');
        this.g = canvas.getContext('2d'); //the graphics object

        this.toasts = [];

        return toastInstance;
    }

    add(id, title, lines, config) {
        var toast = this.toasts.find(t => t.id === id);
        if(!toast) {
            toast = new Toast(this.g, id, title, lines, config);
            this.toasts.push(toast);
        } else {
            toast.start = (new Date()).getTime();
        }
    }

    draw(g) {
        if(this.toasts.length > 0)
            this.toasts[0].draw(g);
    }

    update() {
        if(this.toasts.length > 0) {
            var time = (new Date()).getTime();
            this.toasts = this.toasts.filter(t => !t.start || t.duration > time - t.start);
            if(this.toasts.length > 0 && !this.toasts[0].start) {
                this.toasts[0].start = time;
            }
        }
    }
}
