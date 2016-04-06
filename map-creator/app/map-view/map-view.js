'use strict';

angular.module('myApp.mapView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'map-view/map-view.html',
        controller: 'MapViewCtrl'
    });
}])

.controller('MapViewCtrl', ["$scope", "guid",
        function($scope, guid) {
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
                return range($scope.view.x, $scope.view.x + $scope.viewSize.x);
            };

            $scope.rowRange = function() {
                return range($scope.view.y, $scope.view.y + $scope.viewSize.y);
            };

            $scope.backType = function(row, col) {
                return $scope.map.background[row][col];
            };

            $scope.foreType = function(row, col) {
                return $scope.map.foreground[row][col];
            };

            $scope.shiftView = function(dir) {
                if (dir === 'up') {
                    $scope.view.y -= 10;
                    if ($scope.view.y < 0)
                        $scope.view.y = 0;
                }
                if (dir === 'down') {
                    $scope.view.y += 20;
                    if ($scope.view.y + $scope.viewSize.y > $scope.size.y)
                        $scope.view.y = $scope.size.y - $scope.viewSize.y;
                }
                if (dir === 'left') {
                    $scope.view.x -= 20;
                    if ($scope.view.x < 0)
                        $scope.view.x = 0;
                }
                if (dir === 'right') {
                    $scope.view.x += 20;
                    if ($scope.view.x + $scope.viewSize.x > $scope.size.x)
                        $scope.view.x = $scope.size.x - $scope.viewSize.x;
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
                $scope.pencilTip = type.key;
                $scope.pencilId = type.id;
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
                if (!!val) {
                    $scope.map = JSON.parse(val);
                    $scope.mapJSON = "";
                }
            });
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
                $scope.tileTypes.push({
                    img: "",
                    key: ""
                });
            };

            $scope.tileImage = function(type) {
                var type = _.find($scope.tileTypes, function(t) {
                    return t.key === type;
                });
                if(type)
                    return "/resources/" + type.img;
                return "";
            };

            $scope.tileTypes = [{
                img: "bg/sand.png",
                key: "sand",
                id: guid.make()
            }, {
                img: "grass.png",
                key: "grass",
                id: guid.make()
            }, {
                img: "rock.png",
                key: "rock",
                id: guid.make()
            }, {
                img: "bg/water.png",
                key: "water",
                id: guid.make()
            }];
            $scope.$watch("tileTypes", function(val, old) {
                if(old) {
                    console.log(JSON.stringify(val));
                }
            }, true);
        }
    ])
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
    })
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
