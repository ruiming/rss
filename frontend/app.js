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
            'app.tools'
        ])
        .config(config);

    function config($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) {

        $httpProvider.interceptors.push('tokenInjector');

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/home_tpl.html',
                controller: 'HomeController as vm'
            })
            .state('search', {
                url: '/search/:feedlink',
                templateUrl: 'search/search_tpl.html',
                controller: 'SearchController as vm',
                resolve: {
                    feed: function(Feed, $stateParams, $base64) {
                        let feedlink = decodeURIComponent(escape($base64.decode($stateParams.feedlink)));
                        return Feed.search({feedlink: feedlink}).$promise;
                    }
                }
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

    }
}());
