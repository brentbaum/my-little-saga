"use strict";


class Toast {
    constructor(ctx, id, title, lines, config) {
	this.id = id;
	this.title = title;
	this.lines = lines;
	this.start = 0;
	this.duration = config.duration || 1500;
	this.titleSize = config.titleSize || 20;
	this.on = config.toggle || true;
	this.bodySize = 16;
	this.position = {
	    x: config.x || 20,
	    y: config.y || 20
	};
	this.updateBounds(ctx, title, lines); 
    }

    updateBounds(ctx) {
	this.width = this.textWidth(ctx);
	this.height = (10 + this.titleSize) + (10 + this.bodySize * this.lines.length);
    }

    textWidth(ctx) {
	ctx.font = this.bodySize + "px Arial";
	var widths = this.lines.map(txt => ctx.measureText(txt).width);
	ctx.font = this.titleSize + "px Arial";
	widths.push(ctx.measureText(this.title).width);
	console.log(widths);
	return Math.max.apply(null, widths);
    }

    draw(g) {
	g.save();
	this.updateBounds(g);
	g.fillStyle = "rgba(73,49,28, .7)";
	g.strokeStyle = "rgb(255, 255, 255)";
	roundRect(g, this.position.x, this.position.y, 20 + this.width, 15 + this.height, 5, true);
	g.fillStyle = "rgba(255, 255, 255, .8)";
	g.strokeStyle = "rgba(255, 255, 255, .8)";
	g.font = this.titleSize + "px Arial";
	g.fillText(this.title, this.position.x + 10, this.position.y + 25);
	g.font = this.bodySize + "px Arial";
	for (var x = 0; x < this.lines.length; x++) {
	    g.fillText(this.lines[x], this.position.x + 10, (this.position.y + 25) + (this.titleSize + 5) + x * (this.bodySize + 5));
	}
	g.restore();
    }
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined") {
	stroke = true;
    }
    if (typeof radius === "undefined") {
	radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
	ctx.stroke();
    }
    if (fill) {
	ctx.fill();
    }
}
