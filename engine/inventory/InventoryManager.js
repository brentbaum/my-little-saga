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
        this.toastManager.hide("inventory-action");
    };

    updateActionUI() {
        this.showingActions = true;
        var item = this.inventory[this.position];
        var lines = ["Use", "Drop", "Cancel"];
        lines[this.actionPosition] = ">> " + lines[this.actionPosition];

        this.toastManager.updateInventoryAction(item, lines);

    };

    updateInventoryUI() {
        var inventoryLines = [];
        for (var i = 0; i < this.inventory.length; i++) {
            inventoryLines[i] = ((i == this.position) ? ">> " : "") + " " + this.inventory[i].name + "(" + this.inventory[i].count + ")";
        }
        inventoryLines.push(((this.position == this.inventory.length) ? ">> " : "") + "Close");
        this.toastManager.updateInventory(inventoryLines);
    }

    hideItemAction() {
        this.actionPosition = -1;
        this.showingActions = false;
        this.toastManager.hide("inventory-action");
    }

    selectItemAction() {
        if(this.actionPosition === 0)
            return;
        else if(this.actionPosition === 1) {
            this.inventory[this.position].count--;
            if(this.inventory[this.position].count === 0) {
                this.inventory.splice(this.position, 1);
                this.hideItemAction();
            } else {
                this.updateActionUI();
            }
            this.updateInventoryUI();
        }
        else if(this.actionPosition === 2) {
            this.hideItemAction();
        }
    }

    update(pressedKeys) {
        if(!this.inventory)
            return;
        if (pressedKeys.includes(keycodes.up)) {
            if(!this.showingActions) {
                if (this.position > 0) {
                    this.position -= 1;
                }
                this.updateInventoryUI();
            } else {
                if (this.actionPosition > 0) {
                    this.actionPosition -= 1;
                }
                this.updateActionUI();
            }
        }
        if (pressedKeys.includes(keycodes.down)) {
            if(!this.showingActions) {
                if (this.position < this.inventory.length) {
                    this.position += 1;
                }
                this.updateInventoryUI();
            } else {
                if (this.actionPosition < 2) {
                    this.actionPosition += 1;
                }
                this.updateActionUI();
            }
        }
        if (pressedKeys.includes(keycodes.space)) {
            if(!this.showingActions) {
                if(this.position === this.inventory.length)
                    this.close();
                else {
                    this.actionPosition = 0;
                    this.updateActionUI();
                }
            } else {
                this.selectItemAction();
            }
        }
        if (pressedKeys.includes(keycodes.i)) {
            this.close();
        }
    }

}
