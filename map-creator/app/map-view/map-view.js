'use strict';

angular.module('myApp.mapView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'map-view/map-view.html',
        controller: 'MapViewCtrl'
    });
}])

.controller('MapViewCtrl', ["$scope", "guid", "$http",
        function($scope, guid, $http) {
            $scope.pencilTip = "grass";
            $scope.layer = "background";
            $scope.message = "Here is a map. It is blank";
            $scope.size = {
                x: 40,
                y: 50
            };

            $scope.view = {
                x: 0,
                y: 0
            };
            $scope.viewSize = {
                x: 30,
                y: 20
            };

            var range = function(start, max) {
                var m = [];
                for (var x = start; x < max; x++) {
                    m.push(x);
                }
                return m;
            };

            $scope.colRange = function() {
                if($scope.size.x < $scope.viewSize.x)
                    return range(0, $scope.size.x);
                return range($scope.view.x, $scope.view.x + $scope.viewSize.x);
            };

            $scope.rowRange = function() {
                if($scope.size.y < $scope.viewSize.y)
                    return range(0, $scope.size.y);
                return range($scope.view.y, $scope.view.y + $scope.viewSize.y);
            };

            $scope.backType = function(row, col) {
                if($scope.map.foreground.length <= row)
                    return "";
                if($scope.map.foreground[0].length <= col)
                    return "";
                return $scope.map.background[row][col];
            };

            $scope.foreType = function(row, col) {
                if($scope.map.foreground.length <= row)
                    return "";
                if($scope.map.foreground[0].length <= col)
                    return "";

                return $scope.map.foreground[row][col];
            };

            $scope.tileRange = function() {
                return range(0, Math.ceil($scope.tileTypes.length / 10));
            };

            $scope.tileColumn = function(index) {
                return $scope.tileTypes.slice(index * 10, (index + 1) * 10);
            };

            $scope.shiftView = function(dir) {
                if (dir === 'up') {
                    $scope.view.y -= 10;
                    if ($scope.view.y < 0)
                        $scope.view.y = 0;
                }
                if (dir === 'down') {
                    $scope.view.y += 10;
                    if ($scope.view.y + $scope.viewSize.y > $scope.size.y)
                        $scope.view.y = $scope.size.y - $scope.viewSize.y;
                }
                if (dir === 'left') {
                    $scope.view.x -= 10;
                    if ($scope.view.x < 0)
                        $scope.view.x = 0;
                }
                if (dir === 'right') {
                    $scope.view.x += 10;
                    if ($scope.view.x + $scope.viewSize.x > $scope.size.x)
                        $scope.view.x = $scope.size.x - $scope.viewSize.x;
                }
            };

            $scope.addTiles = function(dir) {
                if (dir === 'up') {
                    $scope.size.y += 10;
                    $scope.view.y += 10;
                    var newTiles = createBlankMap($scope.size.x, 10);
                    $scope.map.background = newTiles.background.concat($scope.map.background);
                    $scope.map.foreground = newTiles.foreground.concat($scope.map.foreground);
                }
                if (dir === 'down') {
                    $scope.size.y += 10;
                    var newTiles = createBlankMap($scope.size.x, 10);
                    $scope.map.background = $scope.map.background.concat(newTiles.background);
                    $scope.map.foreground = $scope.map.foreground.concat(newTiles.foreground);
                }
                if (dir === 'left') {
                    $scope.size.x += 10;
                    $scope.view.x += 10;
                    var newTiles = createBlankMap(10, $scope.size.y);
                    $scope.map.background = _.map($scope.map.background, function(row, index) {
                        return newTiles.background[index].concat(row);
                    });
                    $scope.map.foreground = _.map($scope.map.foreground, function(row, index) {
                        return newTiles.foreground[index].concat(row);
                    });
                }
                if (dir === 'right') {
                    $scope.size.x += 10;
                    var newTiles = createBlankMap(10, $scope.size.y);
                    $scope.map.background = _.map($scope.map.background, function(row, index) {
                        return row.concat(newTiles.background[index]);
                    });
                    $scope.map.foreground = _.map($scope.map.foreground, function(row, index) {
                        return row.concat(newTiles.foreground[index]);
                    });
                }

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
            var isShiftDown = false;

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
                    if(isShiftDown)
                        $scope.map[$scope.layer][r][c] = "";
                    else
                        $scope.map[$scope.layer][r][c] = $scope.pencilTip;
                }
            };

            $scope.clickTile = function(r, c, $event) {
                isShiftDown = $event.shiftKey;
                if($event.shiftKey) {
                    $scope.map[$scope.layer][r][c] = "";
                }
                else {
                    $scope.map[$scope.layer][r][c] = $scope.pencilTip;
                }
            };

            $scope.clearGrid = function(override) {
                if (!override) {
                    var result = confirm("You're about to clear the map! Did you mean to do this?");
                    if (!result)
                        return;
                }
                $scope.map = createBlankMap(20, 15);
            };

            $scope.setTileType = function(type) {
                $scope.pencilTip = type.key;
                $scope.pencilId = type.id;
            };

            $scope.setLayer = function(type) {
                $scope.layer = type;
            };

            $scope.saveMap = function() {
                var filename = prompt("Filename?", "map.json");
                if (filename) {
                    $http.post("/save/map", {
                        filename: filename,
                        map: $scope.map
                    }).then(function(res) {
                        console.log(res);
                    });
                }
            };

            $scope.saveMapping = function() {
                $http.post("/save/mapping", {
                    list: $scope.tileTypes
                }).then(function(res) {
                    console.log(res);
                });
            };

            $scope.loadSavedMapping = function() {
                $http.get("/load/mapping")
                    .then(function(res) {
                        $scope.tileTypes = res.data.list;
                    }, function() {
                        alert("Loading failed.")
                    });
            };

            $scope.loadSavedMap = function() {
                var filename = prompt("Filename?", "map.json");
                if (filename)
                    $http.post("/load/map", {
                        filename: filename
                    })
                    .then(function(res) {
                        $scope.map = res.data;

                    }, function() {
                        alert("Loading failed.")
                    });
            };

            var editing = {
                typeId: ""
            };

            $scope.editType = function(type) {
                editing.typeId = type.id;
            };

            $scope.doneEditing = function() {
                editing.typeId = "";
            };

            $scope.editingType = function(type) {
                return (type.id === editing.typeId);
            };

            $scope.addTileType = function() {
                var type = {
                    img: "",
                    key: "",
                    id: guid.make()
                };
                $scope.tileTypes.push(type);
                editing.typeId = type.id;
            };

            $scope.tileImage = function(type) {
                var type = _.find($scope.tileTypes, function(t) {
                    return t.key === type;
                });
                if (type)
                    return "/resources/" + type.img;
                return "";
            };

            function loadTileTypes() {
                $scope.tileTypes = [{
                    img: "bg/sand.png",
                    key: "sand",
                    id: guid.make()
                }, {
                    img: "bg/grass.png",
                    key: "grass",
                    id: guid.make()
                }, {
                    img: "fg/rock.png",
                    key: "rock",
                    id: guid.make()
                }, {
                    img: "bg/water.png",
                    key: "water",
                    id: guid.make()
                }];
                var stored = localStorage.getItem("types");
                if (stored) {
                    $scope.tileTypes = JSON.parse(stored).list;
                }
            }

            function validJSON(text) {

                return (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
            }

            function loadMap() {
                var stored = localStorage.getItem("map");
                if (stored && validJSON(stored)) {
                    $scope.map = JSON.parse(stored);
                    $scope.size.x = $scope.map.background[0].length;
                    $scope.size.y = $scope.map.background.length;
                } else
                    $scope.clearGrid(true);
            }
            loadTileTypes();
            loadMap();
            $scope.$watch("map", function(val, old) {
                if (old) {
                    var json = JSON.stringify(val);
                    localStorage.setItem("map", json);
                }
            }, true);
            $scope.$watch("tileTypes", function(val, old) {
                if (old) {
                    var json = JSON.stringify({
                        list: val
                    });
                    localStorage.setItem("types", json);
                }
            }, true);
            window.addEventListener('keyup', function(event) {
                if (event.keyCode === 37) {
                    $scope.shiftView('left');
                }
                if (event.keyCode === 38) {
                    $scope.shiftView('up');
                }
                if (event.keyCode === 39) {
                    $scope.shiftView('right');
                }
                if (event.keyCode === 40) {
                    $scope.shiftView('down');
                }
                if (event.keyCode === 70) {
                    $scope.setLayer('foreground');
                }
                if (event.keyCode === 66) {
                    $scope.setLayer('background');
                }
                $scope.$apply();
            });
        }
    ])
    .service("guid", function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };

        return {
            make: function() {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            }
        };
    });
