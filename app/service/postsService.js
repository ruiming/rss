(function() {
    angular
        .module('app')
        .factory('Posts', $resource => { 
            return $resource('/api/posts', null, {
                get: {method: 'GET', params: {type: '@type', feed_id: '@feed_id'}},    // 获取指定类型的订阅文章
                recent: {method: 'GET', url: '/api/posts/recent'}   // 获取最近的未读订阅文章
            });
        })
}());
