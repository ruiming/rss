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
                post: ["Post", "$stateParams", "$state", function (Post, $stateParams, $state) {
                    return Post.get({ feed_id: $stateParams.id, id: $stateParams.post_id }).$promise;
                }]
            }
        });
    }
})();

(function () {
    scrollListen.$inject = ["_", "Post", "storage"];
    angular.module('app').directive('scrollListen', scrollListen);

    function scrollListen(_, Post, storage) {
        return {
            restrict: 'EA',
            scope: true,
            link: function link(scope, elem, attrs) {
                var first = true;
                var func = _.throttle(function (e) {
                    if (void 0 !== scope.vm.currentPostDetail && null !== scope.vm.currentPostDetail && !scope.vm.currentPostDetail.finish) {
                        var target = e.target;
                        if (first && target.scrollHeight - target.clientHeight === target.scrollTop) {
                            // Read over
                            Post.update({ feed_id: scope.vm.currentPost.feed_id, id: scope.vm.currentPost._id }, {
                                type: 'finish'
                            });
                            first = false;
                            scope.vm.status = '读完啦~\(≧▽≦)/~';
                        }
                    }
                }, 200);
                angular.element(elem).on('scroll', func);
                // 如果没有滚动条的话，则立即标为读完
                setTimeout(function () {
                    if (void 0 !== scope.vm.currentPostDetail && null !== scope.vm.currentPostDetail && !scope.vm.currentPostDetail.finish) {
                        if (angular.element(elem[0].scrollHeight)[0] === angular.element(elem[0].offsetHeight)[0]) {
                            Post.update({ feed_id: scope.vm.currentPost.feed_id, id: scope.vm.currentPost._id }, {
                                type: 'finish'
                            });
                            scope.vm.status = '读完啦~\(≧▽≦)/~';
                        }
                    }
                }, 0);

                // TODO: if there is no scroll bar...
                // TODO: The first time load...
            }
        };
    }
})();
/**
 * 单体通信
 */
(function () {
    angular.module('app').factory('storage', storage);

    function storage() {
        var kkk = {};
        return kkk;
    }
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
    angular.module('app').filter('linkFix', ["$state", function ($state) {
        return function (input, origin) {
            var re = /src="(\/[^\/].+?)"/g;
            var result = input.replace(re, function (match, p, offset, string) {
                return "src=\"" + origin + p.slice(1) + "\"";
            });
            return result;
        };
    }]);
})();

(function () {
    angular.module('app').filter('toLocalString', ["$filter", function ($filter) {
        return function (input, format) {
            return $filter('date')(Date.parse(input), format);
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
    angular.module('app').directive('contextMenu', contextMenu);

    function contextMenu() {
        return {
            restrict: 'EA',
            scope: true,
            replace: true,
            templateUrl: 'contextMenu/contextMenu.html',
            controller: ["$scope", "Feed", "storage", function contextMenuController($scope, Feed, storage) {
                $scope.time = Date.now();
                Feed.get(function (res) {
                    $scope.feeds = res.data;
                });
                $scope.setTitle = function () {
                    storage.title = '';
                    storage.status = '';
                    storage.begintime = '';
                };
                setInterval(function () {
                    $scope.time = Date.now();
                    $scope.$digest();
                }, 1000);
            }]
        };
    }
})();
(function () {
    FeedController.$inject = ["feed", "posts", "_", "storage", "$scope", "Post", "$state"];
    angular.module('app').controller('FeedController', FeedController);

    function FeedController(feed, posts, _, storage, $scope, Post, $state) {
        var vm = this;
        vm.read = read;
        vm.readall = readall;

        vm.feed = feed.data;
        vm.posts = posts.data.posts;
        vm.detail = _.groupBy(posts.data.detail, 'post_id');

        $state.current.data = feed.data.link;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = vm.posts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var post = _step.value;

                if (vm.detail[post._id] && vm.detail[post._id][0].read) {
                    post.read = true;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        function read(post) {
            if (post.read) {
                return;
            } else {
                post.read = true;
                Post.update({ feed_id: post.feed_id[0], id: post._id }, { type: 'read' });
            }
        }

        function readall() {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = vm.posts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var post = _step2.value;

                    post.read = true;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            Post.update({ feed_id: vm.feed.feed_id, id: 0 }, { type: 'read' });
        }
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
    PostController.$inject = ["$state", "post", "storage", "$scope", "_", "$rootScope"];
    angular.module('app').controller('PostController', PostController);

    function PostController($state, post, storage, $scope, _, $rootScope) {
        var vm = this;

        vm.currentPost = post.data.result;
        vm.currentPostDetail = post.data.detail;
        vm.begintime = Date.now();
        vm.currenttime = Date.now();
        vm.status = '';
        setInterval(function () {
            vm.currenttime = Date.now();
            $scope.$digest();
        }, 1000);

        // TODO: 黑人问号? I just want to get the title but avoid the break of inherit
        if (void 0 !== $state.router.globals.$current.parent.self.data) {
            vm.origin = $state.router.globals.$current.parent.self.data;
        } else {
            vm.origin = $state.router.globals.current.data;
        }

        if (vm.currentPostDetail !== null && vm.currentPostDetail.finish) {
            vm.status = '已经读过啦~\(≧▽≦)/~';
        }
    }
})();