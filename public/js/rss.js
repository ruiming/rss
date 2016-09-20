"use strict";

(function () {
    config.$inject = ["$httpProvider", "$stateProvider", "$locationProvider", "$urlRouterProvider"];
    angular.module('app', ['ui.router', 'ui.bootstrap', 'ngTouch', 'ngAnimate', 'ngResource', 'ngSanitize']).config(config);

    function config($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'home/home_tpl.html',
            controller: 'HomeController as vm'
        }).state('feed', {
            url: '/feed/:id',
            templateUrl: 'feed/feed_tpl.html',
            controller: 'FeedController as vm',
            resolve: {
                feed: ["Feed", "$stateParams", function (Feed, $stateParams) {
                    return Feed.get({ id: $stateParams.id }).$promise;
                }],
                posts: ["Post", "$stateParams", function (Post, $stateParams) {
                    return Post.get({ feed_id: $stateParams.id }).$promise;
                }]
            }
        }).state('feed.post', {
            url: '/feed/:id/post/:post_id',
            templateUrl: 'post/post_tpl.html',
            controller: 'PostController as vm',
            resolve: {
                posts: ["Post", "$stateParams", "$state", function (Post, $stateParams, $state) {
                    return Post.get({ feed_id: $stateParams.id, id: $stateParams.post_id }).$promise;
                }]
            }
        });
    }
})();

(function () {
    angular.module('app').filter('toLocalString', ["$filter", function ($filter) {
        return function (input) {
            return $filter('date')(Date.parse(input), 'yyyy-MM-dd HH:mm');
        };
    }]);
})();

(function () {
    angular.module('app').factory('Feed', function ($resource) {
        return $resource('/api/feed/:id', { id: '@_id' });
    });
})();

(function () {
    angular.module('app').factory('Post', function ($resource) {
        return $resource('/api/feed/:feed_id/post/:id', { id: '@id' });
    });
})();

(function () {
    angular.module('app').directive('contextMenu', contextMenu);

    function contextMenu() {
        return {
            restrict: 'EA',
            scope: true,
            replace: true,
            templateUrl: 'contextMenu/contextMenu.html',
            controller: ["$scope", "Feed", function contextMenuController($scope, Feed) {
                Feed.get(function (res) {
                    $scope.feeds = res.data;
                });
            }]
        };
    }
})();
(function () {
    angular.module('app').directive('feedPanel', feedPanel);

    function feedPanel() {
        return {
            restrict: 'EA',
            scope: {
                feed: '='
            },
            replace: true,
            templateUrl: 'feedPanel/feedPanel.html',
            controller: ["$scope", function navbarController($scope) {}]
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
            replace: true,
            templateUrl: 'navbar/navbar.html',
            controller: ["$scope", function navbarController($scope) {}]
        };
    }
})();
(function () {
    FeedController.$inject = ["feed", "posts"];
    angular.module('app').controller('FeedController', FeedController);

    function FeedController(feed, posts) {
        var vm = this;
        vm.feed = feed.data;
        vm.posts = posts.data;
        console.log(vm.feed);
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
    PostController.$inject = ["posts"];
    angular.module('app').controller('PostController', PostController);

    function PostController(posts) {
        var vm = this;
        console.log(posts);
        vm.currentPost = posts.data;
    }
})();