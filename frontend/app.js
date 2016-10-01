(function() {
    angular
        .module('app', [
            'ngTouch',
            'ngAnimate',
            'ngResource',
            'ngSanitize',
            'ngCookies',
            'ui.router',
            'ui.bootstrap',
            'base64',
            'underscore',
            'app.tools',
            'nvd3'
        ])
        .config(config);

    function config($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider, $transitionsProvider) {

        $httpProvider.interceptors.push('tokenInjector');

        $transitionsProvider.onBefore({
            to: state => !!state.abstract
        }, ($transition, $state) => {
            if(angular.isString($transition.to().abstract)) {
                return $state.target($transition.to().abstract);
            }
        });

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/home_tpl.html',
                controller: 'HomeController as vm',
                resolve: {
                    posts: function(Posts) {
                        return Posts.recent().$promise;
                    }
                }
            })
            .state('search', {
                url: '/search/:feedlink',
                templateUrl: 'search/search_tpl.html',
                controller: 'SearchController as vm'
            })
            .state('feed', {
                url: '/feed/:id',
                templateUrl: 'feed/feed_tpl.html',
                controller: 'FeedController as vm',
                resolve: {
                    feed: function(Feed, $stateParams) {
                        return Feed.get({id: $stateParams.id}).$promise;
                    },
                    posts: function(Post, $stateParams) {
                        return Post.get({feed_id: $stateParams.id}).$promise;
                    }
                }
            })
            .state('feed.post', {
                url: '/post/:post_id',
                templateUrl: 'post/post_tpl.html',
                controller: 'PostController as vm',
                resolve: {
                    post: function(Post, $stateParams, $state) {
                        return Post.get({feed_id: $stateParams.id, id: $stateParams.post_id}).$promise;
                    }
                }
            })
            .state('posts', {
                url: '/posts/:type',
                templateUrl: 'posts/posts_tpl.html',
                controller: 'PostsController as vm',
                resolve: {
                    posts: function(Posts, $stateParams, $q) {
                        let defer = $q.defer();
                        if(['unread', 'mark'].indexOf($stateParams.type) !== -1) {
                            defer.resolve(Posts.get({type: $stateParams.type}).$promise);
                        } else {
                            defer.reject('参数不正确');
                        }
                        return defer.promise;
                    },
                }
            })
            .state('posts.post', {
                url: '/post/:id',
                templateUrl: 'post/post_tpl.html',
                controller: 'PostController as vm',
                resolve: {
                    post: function(Post, $stateParams, $state) {
                        return Post.get({feed_id: $state.$current.self.data, id: $stateParams.id}).$promise;
                    }
                }
            })
    }
}());
