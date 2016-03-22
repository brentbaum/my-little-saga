"use strict";

class MapGenerator {
    constructor() {
    }

    generate(tileCount) {
        var map = {
            background: [],
            foreground: []
        };
        for (var x = 0; x < tileCount.x; x++) {
            var row = [];
            for (var y = 0; y < tileCount.y; y++) {
                var tileType = "grass";
                if (x === 0) {
                    tileType = "dirt-grass-right";
                } else if (x === tileCount.x - 1) {
                    tileType = "dirt-grass-left";
                } else if (y === 0) {
                    tileType = "dirt-grass-down";
                } else if (y === tileCount.y - 1) {
                    tileType = "dirt-grass-up";
                }
                row.push(tileType);
            }
            map.background.push(row);
        }

        for (var x = 0; x < tileCount.x; x++) {
            var row = [];
            for (var y = 0; y < tileCount.y; y++) {
                var tileType = "";
                if (y === 3 && (Math.floor(x / 2) % 3 === 0)) {
                    tileType = "rock";
                }
                row.push(tileType);
            }
            map.foreground.push(row);
        }
        return map;
    }
}
