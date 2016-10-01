"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function () {
    config.$inject = ["$httpProvider", "$stateProvider", "$locationProvider", "$urlRouterProvider", "$transitionsProvider"];
    angular.module('app', ['ngTouch', 'ngAnimate', 'ngResource', 'ngSanitize', 'ngCookies', 'ui.router', 'ui.bootstrap', 'base64', 'underscore', 'app.tools', 'nvd3']).config(config);

    function config($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider, $transitionsProvider) {

        $httpProvider.interceptors.push('tokenInjector');

        $transitionsProvider.onBefore({
            to: function to(state) {
                return !!state.abstract;
            }
        }, function ($transition, $state) {
            if (angular.isString($transition.to().abstract)) {
                return $state.target($transition.to().abstract);
            }
        });

        $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'home/home_tpl.html',
            controller: 'HomeController as vm',
            resolve: {
                posts: ["Posts", function (Posts) {
                    return Posts.recent().$promise;
                }]
            }
        }).state('search', {
            url: '/search/:feedlink',
            templateUrl: 'search/search_tpl.html',
            controller: 'SearchController as vm'
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
        }).state('posts', {
            url: '/posts/:type',
            templateUrl: 'posts/posts_tpl.html',
            controller: 'PostsController as vm',
            resolve: {
                posts: ["Posts", "$stateParams", "$q", function (Posts, $stateParams, $q) {
                    var defer = $q.defer();
                    if (['unread', 'mark'].indexOf($stateParams.type) !== -1) {
                        defer.resolve(Posts.get({ type: $stateParams.type }).$promise);
                    } else {
                        defer.reject('参数不正确');
                    }
                    return defer.promise;
                }]
            }
        }).state('posts.post', {
            url: '/post/:id',
            templateUrl: 'post/post_tpl.html',
            controller: 'PostController as vm',
            resolve: {
                post: ["Post", "$stateParams", "$state", function (Post, $stateParams, $state) {
                    return Post.get({ feed_id: $state.$current.self.data, id: $stateParams.id }).$promise;
                }]
            }
        });
    }
})();

(function () {
    angular.module('app').directive('ngRandomClass', ngRandomClass);

    function ngRandomClass() {
        return {
            restrict: 'EA',
            replace: false,
            scope: {
                ngClasses: "=ngRandomClass"
            },
            link: function link(scope, elem, attr) {
                elem.addClass(scope.ngClasses[Math.floor(Math.random() * scope.ngClasses.length)]);
            }
        };
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
                        // 100px 偏差
                        if (first && target.scrollHeight - target.clientHeight - 100 < target.scrollTop) {
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
        return {};
    }
})();
(function () {
    tokenInjector.$inject = ["$injector", "$q", "$cookies", "$cacheFactory", "$timeout"];
    angular.module('app').factory('tokenInjector', tokenInjector);

    function tokenInjector($injector, $q, $cookies, $cacheFactory, $timeout) {
        var jwt = undefined;

        return {
            // Warning: The cookie should set to httponly to keep safe.
            request: function request(config) {
                if (void 0 === jwt) {
                    jwt = $cookies.get('jwt');
                }
                config.headers['Authorization'] = "Bearer " + jwt;
                return $q.when(config);
            },

            response: function response(config) {
                var data = config.data.data;
                if (Array.isArray(data)) {
                    for (var i = 0, len = data.length; i < len; i++) {
                        if (void 0 !== data[i].feed_id && Array.isArray(data[i].feed_id)) {
                            // 提取 feed_id 
                            if (typeof data[i].feed_id[0] === 'string') {
                                config.data.data[i].feed_id = data[i].feed_id[0];
                            } else {
                                config.data.data[i] = Object.assign(data[i].feed_id[0], data[i], { feed_id: data[i].feed_id[0]._id, feed_title: data[i].feed_id[0].title });
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
                            config.data.data = Object.assign(data.feed_id[0], data, { feed_id: data.feed_id[0]._id, feed_title: data.feed_id[0].title });
                        }
                    }
                    if (void 0 !== data.user_id && Array.isArray(data.user_id)) {
                        config.data.data.user_id = data.user_id[0];
                    }
                }
                return $q.when(config);
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
    angular.module('app').filter('linkFix', function () {
        return function (input, origin) {
            var re = /src="(\/[^\/].+?)"/g;
            var result = input.replace(re, function (match, p, offset, string) {
                return "src=\"" + origin + p.slice(1) + "\"";
            });
            return result;
        };
    });
})();

(function () {
    angular.module('app').filter('timeago', function () {
        return function (input) {
            // TODO: 会被执行两次，并且如果input被watch时会多次执行
            var now = Date.now();
            var ago = (now - Date.parse(input)) / 1000;
            var output = null;
            // TODO: if I want to make it change in real time.
            if (ago < 10 * 60) {
                output = "刚刚";
            } else if (ago < 60 * 60) {
                output = Math.round(ago / 60) + " 分钟前";
            } else if (ago < 60 * 60 * 24) {
                output = Math.round(ago / 60 / 60) + " 小时前";
            } else if (ago < 60 * 60 * 24 * 30) {
                output = Math.round(ago / 60 / 60 / 24) + " 天前";
            } else if (ago < 60 * 60 * 24 * 365) {
                output = Math.round(ago / 60 / 60 / 24 / 30) + " 个月前";
            } else if (ago < 60 * 60 * 24 * 365 * 3) {
                output = Math.round(ago / 60 / 60 / 24 / 365) + " 年前";
            } else {
                output = '很久很久以前';
            }
            return output;
        };
    });
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
        return $resource('/api/feed/:id', { id: '@_id' }, {
            search: { method: 'POST', params: { search: true } }
        });
    });
})();

(function () {
    angular.module('app').factory('Post', function ($cacheFactory, $resource) {
        return $resource('/api/feed/:feed_id/post/:id', { feed_id: '@feed_id', id: '@_id' }, {
            update: { method: 'PUT' },
            get: { method: 'GET', params: { type: '@type' } }
        });
    });
})();

(function () {
    angular.module('app').factory('Posts', function ($resource) {
        return $resource('/api/posts', null, {
            get: { method: 'GET', params: { type: '@type' } },
            recent: { method: 'GET', url: '/api/posts/recent' }
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
            controllerAs: 'vm',
            controller: ["$scope", "$rootScope", "Feed", function navbarController($scope, $rootScope, Feed) {
                var vm = this;

                // Function
                vm.feedit = feedit;

                function feedit() {
                    $scope.feed.feeded = !$scope.feed.feeded;
                    if ($scope.feed.feeded) {
                        Feed.save({ feedlink: $scope.feed.absurl }, function (res) {
                            $rootScope.$broadcast('ADD_FEED', $scope.feed);
                            $scope.feed.feeded = true;
                            $scope.feed.feedNum++;
                        }, function (err) {
                            // TODO
                            console.log(err);
                        });
                    } else {
                        Feed.delete({ id: $scope.feed.feed_id }, function (res) {
                            $rootScope.$broadcast('DELETE_FEED', $scope.feed);
                            $scope.feed.feeded = false;
                            $scope.feed.feedNum--;
                        }, function (err) {
                            // TODO
                            console.log(err);
                        });
                    }
                }
            }]
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
            controllerAs: 'vm',
            controller: ["$scope", "Feed", "_", function contextMenuController($scope, Feed, _) {
                var vm = this;
                vm.time = Date.now();
                vm.feeds = [];

                Feed.get(function (res) {
                    return vm.feeds = res.data;
                });

                setInterval(function () {
                    vm.time = Date.now();
                    $scope.$digest();
                }, 1000);

                $scope.$on('ADD_FEED', function (event, data) {
                    return vm.feeds.push(data);
                });
                $scope.$on('DELETE_FEED', function (event, data) {
                    return vm.feeds = _.filter(vm.feeds, function (feed) {
                        return feed.feed_id != data.feed_id;
                    });
                });
                $scope.$on('READ_POST', function (event, data) {
                    return _.each(vm.feeds, function (feed) {
                        return feed.feed_id === data ? feed.unread-- : '';
                    });
                });
            }]
        };
    }
})();
(function () {
    navbar.$inject = ["$state", "$base64"];
    angular.module('app').directive('navbar', navbar);

    function navbar($state, $base64) {
        return {
            restrict: 'EA',
            scope: {
                title: '='
            },
            replace: true,
            templateUrl: 'navbar/navbar.html',
            controllerAs: 'vm',
            controller: ["$timeout", "tools", function navbarController($timeout, tools) {
                var vm = this,
                    timeout = void 0;

                // Function
                vm.blur = blur;
                vm.search = search;
                vm.focus = focus;

                function focus() {
                    form.input.focus();
                    if (timeout) {
                        $timeout.cancel(timeout);
                    }
                    vm.active = true;
                }
                function blur() {
                    timeout = $timeout(function () {
                        vm.active = false;
                    }, 800);
                }
                function search(feedlink) {
                    if (!tools.checkUrl(feedlink)) {
                        return false;
                    } else {
                        $state.go('search', { feedlink: $base64.encode(unescape(encodeURIComponent(feedlink))) });
                    }
                }
            }]
        };
    }
})();
(function () {
    FeedController.$inject = ["$rootScope", "feed", "posts", "_", "storage", "$scope", "Post", "$state", "Feed", "$stateParams"];
    angular.module('app').controller('FeedController', FeedController);

    function FeedController($rootScope, feed, posts, _, storage, $scope, Post, $state, Feed, $stateParams) {
        var vm = this;
        vm.feed = feed.data;
        vm.feed.feeded = angular.isDefined(feed.data.feed_time);
        vm.feed.feed_id = $stateParams.id;
        vm.posts = posts.data.posts;
        vm.unread = vm.feed.unread;
        vm.detail = _.groupBy(posts.data.detail, 'post_id');

        // Graphy Start 订阅源文章更新情况
        vm.options = {
            chart: {
                type: 'discreteBarChart',
                height: 380,
                margin: {
                    top: 30,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function x(d) {
                    return d.label;
                },
                y: function y(d) {
                    return d.value;
                },
                showValues: true,
                valueFormat: function valueFormat(d) {
                    return d3.format(',.0f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: '月份'
                },
                yAxis: {
                    axisLabel: '最近更新文章数',
                    axisLabelDistance: -10
                },
                tooltip: {
                    valueFormatter: function valueFormatter(d, i) {
                        return d + "篇";
                    }
                }
            }
        };
        vm.data = [{
            key: "最近更新文章数",
            values: []
        }];
        _.each(_.groupBy(posts.data.posts, 'pubdate'), function (value, key) {
            var date = key.slice(0, 7),
                exist = false;
            _.each(vm.data[0].values, function (value, key) {
                if (value.label === date) {
                    value.value++;
                    exist = true;
                }
            });
            if (!exist) vm.data[0].values.push({ label: date, value: 1 });
        });
        vm.data[0].values = _.sortBy(vm.data[0].values, 'label').reverse();
        // Graphy End

        // Function
        vm.read = read;
        vm.readall = readall;
        vm.feedit = feedit;

        // Will be used by its' child state
        $state.current.data = feed.data.link;

        // get the status of each post
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

        function feedit() {
            Feed.save({ feedlink: vm.feed.absurl }, function (res) {
                vm.feed.feeded = true;
                $rootScope.$broadcast('ADD_FEED', vm.feed);
                vm.feed.feedNum++;
            }, function (err) {
                // TODO
                console.log(err);
            });
        }
        function read(post) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = vm.posts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _post = _step2.value;

                    _post.active = false;
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

            post.active = true;
            if (!post.read) {
                vm.unread--;
                post.read = true;
                $rootScope.$broadcast('READ_POST', post.feed_id[0]);
                Post.update({ feed_id: post.feed_id[0], id: post._id }, { type: 'read' });
            }
        }
        function readall() {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = vm.posts[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var post = _step3.value;

                    if (!post.read) {
                        vm.unread--;
                        $rootScope.$broadcast('READ_POST', vm.feed.feed_id);
                    }
                    post.read = true;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            Post.update({ feed_id: vm.feed.feed_id, id: 0 }, { type: 'read' });
        }
    }
})();

(function () {
    HomeController.$inject = ["$timeout"];
    angular.module('app').controller('HomeController', HomeController);

    function HomeController($timeout) {
        var vm = this;
        vm.title = 'It works!';
    }
})();

(function () {
    PostController.$inject = ["$state", "post", "Post", "storage", "$scope", "_", "$rootScope", "$timeout", "$cacheFactory"];
    angular.module('app').controller('PostController', PostController);

    function PostController($state, post, Post, storage, $scope, _, $rootScope, $timeout, $cacheFactory) {
        var vm = this;
        vm.post = post;
        vm.currentPost = post.data.result;
        vm.currentPostDetail = post.data.detail;
        vm.begintime = Date.now();
        vm.currenttime = Date.now();
        vm.status = '';

        // Functon
        vm.love = love;
        vm.mark = mark;
        vm.home = home;

        // Date auto change
        setInterval(function () {
            vm.currenttime = Date.now();
            $scope.$digest();
        }, 1000);

        // Check if the post has been read yet
        if (vm.currentPostDetail !== null && vm.currentPostDetail.finish) {
            vm.status = '已经读过啦~\(≧▽≦)/~';
        }

        function love() {
            vm.currentPostDetail.love = !vm.currentPostDetail.love;
            Post.update({ feed_id: vm.currentPost.feed_id[0], id: vm.currentPost._id }, { type: 'love', revert: true });
        }
        function mark() {
            vm.currentPostDetail.mark = !vm.currentPostDetail.mark;
            Post.update({ feed_id: vm.currentPost.feed_id[0], id: vm.currentPost._id }, { type: 'mark', revert: true });
        }
        function home() {
            $state.go('feed', { id: vm.currentPost.feed_id[0] });
        }
    }
})();

(function () {
    PostsController.$inject = ["_", "$stateParams", "posts", "$state", "Post", "Posts", "$rootScope"];
    angular.module('app').controller('PostsController', PostsController);

    function PostsController(_, $stateParams, posts, $state, Post, Posts, $rootScope) {
        var vm = this;
        vm.posts = posts.data;

        vm.readall = readall;
        vm.randomcolor = randomcolor;
        vm.type = $stateParams.type === 'unread' ? "未读" : "星标";
        vm.unread = vm.posts.length;
        vm.postsByFeed = _.toArray(_.groupBy(posts.data, 'feed_id'));

        // Function
        vm.goto = goto;

        function goto(id) {
            var post = null;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = vm.posts[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var item = _step4.value;

                    if (item._id === id) {
                        item.active = true;
                        post = item;
                    } else item.active = false;
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            if (!post.read) {
                vm.unread--;
                if ($stateParams.type === 'unread') {
                    $rootScope.$broadcast('READ_POST', post.feed_id);
                }
                post.read = true;
                Post.update({ feed_id: post.feed_id, id: post._id }, { type: 'read' });
            }
            $state.current.data = post.feed_id;
            $state.go('posts.post', { id: post._id });
        }
        function readall() {
            var str = '';
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = vm.posts[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var post = _step5.value;

                    if (!post.read) {
                        $rootScope.$broadcast('READ_POST', post.feed_id);
                        vm.unread--;
                    }
                    post.read = true;
                    str += str === '' ? post._id : ',' + post._id;
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            Posts.save({ id: str });
        }
        function randomcolor() {
            var random = Math.floor(Math.random() * 3);
            return random === 0 ? 'warning' : random === 1 ? 'info' : random === 2 ? 'danger' : '';
        }
    }
})();

(function () {
    SearchController.$inject = ["$stateParams", "$base64", "$state", "Feed"];
    angular.module('app').controller('SearchController', SearchController);

    function SearchController($stateParams, $base64, $state, Feed) {
        var vm = this;
        var feedlink = decodeURIComponent(escape($base64.decode($stateParams.feedlink)));
        Feed.search({ feedlink: feedlink }).$promise.then(function (res) {
            $state.go('feed', { id: res.data });
        }, function (err) {
            // TODO
            vm.err = err.data.message;
        });
    }
})();

(function () {
    var help = {
        // 检测 URL 是否合法
        checkUrl: function checkUrl(url) {
            if (!url) return false;
            var re = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
            return url.match(re) !== null;
        }
    };

    // In angular, the module name is app.tools, and the factory name is tools.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = help;
    } else {
        angular.module('app.tools', []).factory('tools', function () {
            return help;
        });
    }
})();