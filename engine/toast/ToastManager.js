"use strict";

let toastInstance = null;
let edge_offset = 25;
let title_body_offset = 4;

var top_left= function(bounds) { return {x: edge_offset, y: edge_offset}; };
var top_middle = function(bounds)  { return {x: (game_size.x - bounds.width) / 2, y: edge_offset}; };
var top_right = function(bounds) { return {x: game_size.x - bounds.width - 260, y: edge_offset}; };
var middle_middle = function(bounds)  { return {x: (game_size.x - bounds.width) / 2, y: (game_size.y - bounds.height) / 2}; };
var middle_right = function(bounds)  { return {x: game_size.x - bounds.width - edge_offset, y: (game_size.y - bounds.height) / 2}; };
var bottom_left = function(bounds) { return {x: edge_offset, y: game_size.y - bounds.height}; };
var bottom_middle = function(bounds) { return {x: (game_size.x - bounds.width) / 2, y: game_size.y - bounds.height}; };
var bottom_right = function(bounds) { return {x: game_size.x - bounds.width - edge_offset, y: game_size.y - bounds.height - edge_offset}; };

var bottom_right_attach = function(bounds) { return {x: game_size.x - bounds.width - edge_offset - 200, y: game_size.y - bounds.height - edge_offset}; };

class ToastManager {

    constructor() {
        if (toastInstance) {
	    return toastInstance;
        }

        var canvas = document.getElementById('game');
        this.g = canvas.getContext('2d'); //the graphics object

        this.toasts = [];
	this.toggleToasts = [];

	toastInstance = this;
        return this;
    }
    
    makeConfig(title, titleSize, lines, bodySize, position_fn, duration) {
	var widths = lines.map(txt => this.g.measureText(txt).width);
	this.g.font = titleSize + "px Arial";
	widths.push(this.g.measureText(this.title).width);
	var size = {width: Math.max.apply(null, widths),
		    height: (10 + titleSize) + (10 + bodySize * lines.length)};
	var position = position_fn(size);
	return {x: position.x, y: position.y, duration: duration};
    }

    put(id, title, lines, size, position_fn, duration) {
	// console.log("ToastManager.add " + id);
	var toast = this.toasts.find(t => t.id === id);
	let config = this.makeConfig(title, size + title_body_offset, lines, size, position_fn, duration);
	if(!toast) {
	    config.duration = duration;
	    toast = new Toast(this.g, id, title, lines, config);
	    this.toasts.push(toast);
	} else {
	    toast.start = (new Date()).getTime();
	    toast.title = title;
	    toast.lines = lines;
	    toast.config = config;
	}
    }

    putToggle(id, title, lines, size, position_fn) {
	// console.log("ToastManager.addToggle " + id);
	var toast = this.toggleToasts.find(t => t.id === id);
	let config = this.makeConfig(title, size + title_body_offset, lines, size, position_fn, 0);
	if (!toast) {
	    config.toggle = true;
	    toast = new Toast(this.g, id, title, lines, config);
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

    updateInventory(lines) {
        this.putToggle("inventory", "Inventory", lines, 20, bottom_right);
    }

    updateInventoryAction(item, lines) {
        this.putToggle("inventory-action", item.name, lines, 20, bottom_right_attach);
    }

    updateActionPrompt(title, lines) {
	this.putToggle("proximity-context", title, lines, 20, top_left);
    }

    updateQuestDisplay(title, lines) {
	this.putToggle("quest", title, lines, 20, top_right);
    }

    updateCenterDisplay(title, lines) {
	this.putToggle("center", title, lines, 36, middle_middle);
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
