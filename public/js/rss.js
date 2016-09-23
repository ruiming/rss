"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function () {
    config.$inject = ["$httpProvider", "$stateProvider", "$locationProvider", "$urlRouterProvider"];
    angular.module('app', ['ui.router', 'ui.bootstrap', 'ngTouch', 'ngAnimate', 'ngResource', 'ngSanitize', 'ngCookies', 'underscore']).config(config);

    function config($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) {

        $httpProvider.interceptors.push('tokenInjector');

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
            url: '/post/:post_id',
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
    scrollListen.$inject = ["_", "Post"];
    angular.module('app').directive('scrollListen', scrollListen);

    function scrollListen(_, Post) {
        return {
            restrict: 'EA',
            scope: true,
            link: function link(scope, elem, attrs) {
                console.log(scope);
                var func = _.throttle(function (e) {
                    var target = e.target;
                    if (target.scrollHeight - target.clientHeight === target.scrollTop) {
                        // Read over
                        Post.update({ feed_id: scope.vm.currentPost.feed_id, id: scope.vm.currentPost._id }, {
                            type: 'read'
                        });
                    }
                }, 300);
                angular.element(elem).on('scroll', func);
            }
        };
    }
})();
(function () {
    angular.module('app').factory('storage', storage);

    function storage() {}
})();
(function () {
    tokenInjector.$inject = ["$injector", "$q", "$cookies"];
    angular.module('app').factory('tokenInjector', tokenInjector);

    function tokenInjector($injector, $q, $cookies) {
        var jwt = undefined;

        return {
            // Warning: The cookie should set to httponly to keep safe.
            request: function request(config) {
                var deferred = $q.defer();
                if (void 0 === jwt) {
                    jwt = $cookies.get('jwt');
                }
                config.headers['Authorization'] = "Bearer " + jwt;
                deferred.resolve(config);
                return deferred.promise;
            },

            response: function response(config) {
                var data = config.data.data;
                if (Array.isArray(data)) {
                    for (var i = 0, len = data.length; i < len; i++) {
                        if (void 0 !== data[i].feed_id && Array.isArray(data[i].feed_id)) {
                            if (typeof data[i].feed_id[0] === 'string') {
                                config.data.data[i].feed_id = data[i].feed_id[0];
                            } else {
                                config.data.data[i] = Object.assign(data[i].feed_id[0], data[i], { feed_id: data[i].feed_id[0]._id });
                            }
                        }
                        if (void 0 !== data[i].user_id && Array.isArray(data[i].user_id)) {
                            config.data.data[i].user_id = data[i].user_id[0];
                        }
                    }
                } else if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === 'object') {
                    if (void 0 !== data.feed_id && Array.isArray(data.feed_id)) {
                        if (typeof data.feed_id[0] === 'string') {
                            config.data.data.feed_id = data.feed_id[0];
                        } else {
                            config.data.data = Object.assign(data.feed_id[0], data, { feed_id: data.feed_id[0]._id });
                        }
                    }
                    if (void 0 !== data.user_id && Array.isArray(data.user_id)) {
                        config.data.data.user_id = data.user_id[0];
                    }
                }
                var deferred = $q.defer();
                deferred.resolve(config);
                return deferred.promise;
            }
        };
    }
})();

(function () {
    var underscore = angular.module('underscore', []);
    underscore.factory('_', ['$window', function ($window) {
        return $window._;
    }]);
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
        return $resource('/api/feed/:feed_id/post/:id', { id: '@id' }, {
            update: { method: 'PUT' }
        });
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
    angular.module('app').directive('statusBar', statusBar);

    function statusBar() {
        return {
            restrict: 'EA',
            scope: true,
            replace: true,
            templateUrl: 'statusBar/statusBar.html',
            controller: ["$scope", "$interval", function statusBarController($scope, $interval) {
                $scope.time = Date.now();
                $interval(function () {
                    $scope.time = Date.now();
                }, 1000);
            }]
        };
    }
})();
(function () {
    FeedController.$inject = ["feed", "posts", "_"];
    angular.module('app').controller('FeedController', FeedController);

    function FeedController(feed, posts, _) {
        var vm = this;
        vm.feed = feed.data;
        vm.posts = posts.data.posts;
        vm.detail = _.groupBy(posts.data.detail, 'post_id');
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
        vm.currentPost = posts.data;
    }
})();