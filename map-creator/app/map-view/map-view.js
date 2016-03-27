'use strict';

angular.module('myApp.mapView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'map-view/map-view.html',
        controller: 'MapViewCtrl'
    });
}])

.controller('MapViewCtrl', ["$scope", function($scope) {
    $scope.pencilTip = "tree";
    $scope.message = "Here is a map. It is blank";
    $scope.size = {
        x: 30,
        y: 20
    };

    function createBlankGrid(rows, cols) {
        var grid = [];
        for (var x = 0; x < cols; x++) {
            var row = [];
            for (var y = 0; y < rows; y++)
                row.push("grass");
            grid.push(row);
        }
        return grid;
    };

    var isMouseDown = false;

    $scope.mouseDown = function() {
        console.log("down");
        isMouseDown = true;
    };

    $scope.mouseUp = function() {
        console.log("up");
        isMouseDown = false;
    };

    $scope.setTile = function(row, index) {
        console.log("Mouse over");
        if (isMouseDown)
            $scope.set(row, index);
    };

    $scope.clearGrid = function(override) {
        if (!override) {
            var result = confirm("You're about to clear the map! Did you mean to do this?");
            if (!result)
                return;
        }
        $scope.grid = createBlankGrid($scope.size.x, $scope.size.y);
    };
    $scope.clearGrid(true);
    $scope.set = function(row, index) {
        row[index] = $scope.pencilTip;
    };

    $scope.setTileType = function(type) {
        $scope.pencilTip = type;
    };

    $scope.downloadCurrentMap = function() {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({background: $scope.grid}));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "map.json");
        dlAnchorElem.click();
    };

    $scope.tileTypes = ["grass", "tree", "rock", "water"];
}]);
