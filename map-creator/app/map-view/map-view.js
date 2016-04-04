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
    $scope.layer = "background";
    $scope.message = "Here is a map. It is blank";
    $scope.size = {
        x: 30,
        y: 20
    };

    var range = function(start, max) {
        var m = [];
        for(var x = start; x < max; x++) {
            m.push(x);
        }
        return m;
    };

    $scope.colRange = function() {
        return range(0, $scope.size.x);
    };

    $scope.rowRange = function() {
        return range(0, $scope.size.y);
    };

    $scope.backType = function(row, col) {
        return $scope.map.background[row][col];
    };

    $scope.foreType = function(row, col) {
        return $scope.map.foreground[row][col];
    };

    function createBlankMap(rows, cols) {
        var map = {
            background: [],
            foreground: []
        };
        for (var x = 0; x < cols; x++) {
            var bRow = [];
            var fRow = [];
            for (var y = 0; y < rows; y++) {
                bRow.push("grass");
                fRow.push("");
            }
            map.background.push(bRow);
            map.foreground.push(fRow);
        }
        return map;
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

    $scope.setTile = function(r, c) {
        if (isMouseDown) {
            $scope.map[$scope.layer][r][c] = $scope.pencilTip;
        }
    };

    $scope.clickTile = function(r, c) {
        $scope.map[$scope.layer][r][c] = $scope.pencilTip;
    };

    $scope.clearGrid = function(override) {
        if (!override) {
            var result = confirm("You're about to clear the map! Did you mean to do this?");
            if (!result)
                return;
        }
        $scope.map = createBlankMap($scope.size.x, $scope.size.y);
    };
    $scope.clearGrid(true);

    $scope.setTileType = function(type) {
        $scope.pencilTip = type;
    };

    $scope.setLayer = function(type) {
        $scope.layer = type;
    };

    $scope.downloadCurrentMap = function() {
        var str = JSON.stringify($scope.map, undefined, 2);
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(str);
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "map.json");
        dlAnchorElem.click();
    };

    $scope.mapJson = "";

    $scope.$watch("mapJson", function(val) {
        if(!!val) {
            $scope.map = JSON.parse(val);
            $scope.mapJSON = "";
        }
    });

    $scope.tileTypes = ["grass", "tree", "rock", "water"];
}])
.directive('appFilereader', function($q) {
    var slice = Array.prototype.slice;

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
                if (!ngModel) return;

                ngModel.$render = function() {};

                element.bind('change', function(e) {
                    var element = e.target;

                    $q.all(slice.call(element.files, 0).map(readFile))
                        .then(function(values) {
                            if (element.multiple) ngModel.$setViewValue(values);
                            else ngModel.$setViewValue(values.length ? values[0] : null);
                        });

                    function readFile(file) {
                        var deferred = $q.defer();

                        var reader = new FileReader();
                        reader.onload = function(e) {
                            deferred.resolve(e.target.result);
                        };
                        reader.onerror = function(e) {
                            deferred.reject(e);
                        };
                        reader.readAsText(file);

                        return deferred.promise;
                    }

                }); //change

            } //link
    }; //return
});
