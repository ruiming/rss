(function() {
    angular
        .module('app', [
            'ui.router',
            'ui.bootstrap',
            'ngTouch',
            'ngAnimate',
            'ngResource',
            'ngSanitize'
        ])
        .config(config);

    function config($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/home_tpl.html',
                controller: 'HomeController as vm'
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
                    posts: function(Post, $stateParams, $state) {
                        return Post.get({feed_id: $stateParams.id, id: $stateParams.post_id}).$promise;
                    }
                }
            })

    }
}());
