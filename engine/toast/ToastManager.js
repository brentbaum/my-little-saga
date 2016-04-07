"use strict";

let toastInstance = null;


class ToastManager {

    constructor() {
        if(toastInstance) {
	    return toastInstance;
        }

        var canvas = document.getElementById('game');
        this.g = canvas.getContext('2d'); //the graphics object

        this.toasts = [];
	this.toggleToasts = [];

	toastInstance = this;
        return this;
    }

    static top_left()  { return {x: 300, y: 300}}
    static top_middle()  { return {x: game_size.y / 2, y: 300}}
    static top_right()  { return {x: game_size.x - 300, y: 300}}
    static bottom_left()  { return {x: 30, y: game_size.y - 200}}
    static bottom_middle()  { return  {x: game_size.x / 2, y: game_size.y - 300}}
    static bottom_right()  { return {x: game_size.x - 300, y: game_size.y - 300}}

    put(id, title, lines, config) {
	// console.log("ToastManager.add " + id);
	var toast = this.toasts.find(t => t.id === id);
	if(!toast) {
	    toast = new Toast(this.g, id, title, lines, config);
	    this.toasts.push(toast);
	} else {
	    toast.start = (new Date()).getTime();
	    toast.title = title;
	    toast.lines = lines;
	    toast.config = config;
	}
    }

    putToggle(id, title, lines, config) {
	// console.log("ToastManager.addToggle " + id);
	var toast = this.toggleToasts.find(t => t.id === id);
	if (!toast) {
	    var conf = config;
	    conf.toggle = true;
	    toast = new Toast(this.g, id, title, lines, conf);
	    this.toggleToasts.push(toast);
	} else {
	    toast.on = true;
	    toast.title = title;
	    toast.lines = lines;
	    toast.config = config;
	}
    }

    hide(id) {
	var toast = this.toggleToasts.find(t => t.id === id);
	if (toast)
	    toast.on = false;
    }

    show(id) {
	var toast = this.toggleToasts.find(t => t.id === id);
	if (toast)
	    toast.on = true;
    }

    updateActionPrompt(title, lines) {
	this.addToggle("action-prompt", title, lines, ToastManager.bottom_middle());
    }

    draw(g) {
	if (this.toasts.length > 0)
	    for (var toast of this.toasts) {
		toast.draw(g);
	    }

	for (var toast of this.toggleToasts) {
	    if (toast.on) {
		toast.draw(g);
	    }
	}
    }

    update() {
	if (this.toasts.length > 0) {
	    var time = (new Date()).getTime();
	    this.toasts = this.toasts.filter(t => !t.start || t.duration > time - t.start);
	}
    }
}
