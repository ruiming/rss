(function() {
    angular
        .module('app')
        .factory('tokenInjector', tokenInjector);

    function tokenInjector($injector, $q, $cookies, $cacheFactory, $timeout) {
        
        var count = {};

        return {

            response: function(config) {
                let data = config.data.data;
                count[config.config.url] = undefined;
                if(Array.isArray(data)) {
                    for(let i = 0, len = data.length; i < len; i++) {
                        if(void 0 !== data[i].feed_id && Array.isArray(data[i].feed_id)) {
                            // 提取 feed_id 
                            if(typeof data[i].feed_id[0] === 'string') {
                                config.data.data[i].feed_id = data[i].feed_id[0];
                            } else {
                                config.data.data[i] = Object.assign(data[i].feed_id[0], data[i], {feed_id: data[i].feed_id[0]._id, feed_title: data[i].feed_id[0].title});                             
                            }
                        }
                        if(void 0 !== data[i].user_id && Array.isArray(data[i].user_id)) {
                            config.data.data[i].user_id = data[i].user_id[0];
                        }
                    }
                } else if (typeof data === 'object'){
                        if(void 0 !== data.feed_id && Array.isArray(data.feed_id)) {
                            if(typeof data.feed_id[0] === 'string') {
                                config.data.data.feed_id = data.feed_id[0];
                            } else {
                                config.data.data = Object.assign(data.feed_id[0], data, {feed_id: data.feed_id[0]._id, feed_title: data.feed_id[0].title});                                                            
                            }
                        }
                        if(void 0 !== data.user_id && Array.isArray(data.user_id)) {
                            config.data.data.user_id = data.user_id[0];
                        }
                }
                return $q.when(config);
            },
        
            // 正常情况下，XSRF 不正确会触发该错误
            // 从而触发跳转到登录页面
            // TODO 全局提示弹框
            responseError: function(rejection) {
                if(rejection.status === 401) {
                    console.log(rejection.data.message);
                    setTimeout(() => document.location.replace('/'), 1000);
                    return $q.reject(rejection);
                } else if ((rejection.status === 404 || rejection.status === -1) && (rejection.data === null || rejection.data.success !== undefined) && count[rejection.config.url] === undefined) {
                    count[rejection.config.url] = true;
                    var $http = $injector.get('$http');
                    return $http(rejection.config);
                }
                return $q.reject(rejection);
            }
        }
        
    }

}());
