"use strict";

(function () {
    config.$inject = ["$stateProvider", "$locationProvider", "$urlRouterProvider"];
    angular.module('app', ['ui.router', 'ui.bootstrap', 'ngTouch', 'ngAnimate']).config(config);

    function config($stateProvider, $locationProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'home/home_tpl.html',
            controller: 'HomeController as vm'
        });
    }
})();

(function () {
    angular.module('app').controller('HomeController', HomeController);

    function HomeController() {
        var vm = this;
        vm.title = 'It works!';
    }
})();

(function () {
    angular.module('app').directive('contextMenu', contextMenu);

    function contextMenu() {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: 'contextMenu/contextMenu.html',
            controller: ["$scope", function contextMenuController($scope) {}]
        };
    }
})();
(function () {
    angular.module('app').directive('navbar', navbar);

    function navbar() {
        return {
            restrict: 'EA',
            scope: {
                title: '='
            },
            templateUrl: 'navbar/navbar.html',
            controller: ["$scope", function navbarController($scope) {}]
        };
    }
})();