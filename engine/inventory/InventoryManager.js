"use strict";

let inventoryInstance = null;


// Sax - a kind of short, heavy sword or sabre, with only one sharp edge
var INPUT_BUF_SIZE = 10;
var playerName = "Ragnar";

class InventoryManager {

    constructor() {
        if (inventoryInstance) {
            return inventoryInstance;
        }

        var canvas = document.getElementById('game');
        this.g = canvas.getContext('2d'); //the graphics object
        this.toastManager = new ToastManager();

        this.position = 0; // || "action"

        inventoryInstance = this;
        return this;
    }

    open(inventory) {
        let saga = Game.getInstance();
        saga.inInventory = true;

        this.position = 0;
        this.inventory = inventory;
        this.updateInventoryUI();
    }

    close() {
        let saga = Game.getInstance();
        saga.inInventory = false;
        console.log(saga);

        this.position = 0;
        this.inventory = null;
        this.toastManager.hide("inventory");
    };

    updateInventoryUI() {
        let x = game_size.x / 2;
        let y = game_size.y / 2;
        var inventoryLines = [];
        for (var i = 0; i < this.inventory.length; i++) {
            inventoryLines[i] = ((i == this.position) ? ">> " : "") + " " + this.inventory[i].name + "(" + this.inventory[i].count + ")";
        }
        var config = ToastManager.top_right();
        config.titleSize = 16;
        this.toastManager.putToggle("inventory", "Inventory", inventoryLines, config);
        // TODO toast progress
    }

    update(pressedKeys) {
        if(!this.inventory)
            return;
        if (pressedKeys.includes(keycodes.up)) {
            if (this.position > 0) {
                this.position -= 1;
            }
            this.updateInventoryUI();
        }
        if (pressedKeys.includes(keycodes.down)) {
            if (this.position < this.inventory.length - 1) {
                this.position += 1;
            }
            this.updateInventoryUI();
        }
        if (pressedKeys.includes(keycodes.i)) {
            //this.performAction();
            this.close();
        }
    }

}
