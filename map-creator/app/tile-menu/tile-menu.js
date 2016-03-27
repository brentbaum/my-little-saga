'use strict';

angular.module('myApp.tileMenu', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'tile-menu/tile-menu.html',
        controller: 'TileMenuCtrl'
    });
}])

.controller('TileMenuCtrl', ["$scope", function($scope) {
    $scope.message = "hi";
}]);
