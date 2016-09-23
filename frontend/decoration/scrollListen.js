(function() {
    angular
        .module('app')
        .directive('scrollListen', scrollListen);
    
    function scrollListen(_, Post, storage) {
        return {
            restrict: 'EA',
            scope: true,
            link: function(scope, elem, attrs) {
                var func = _.throttle(function(e) {
                    if(scope.vm.posts[scope.vm.currentPost._id] && scope.vm.posts[scope.vm.currentPost._id][0].read) {
                        storage.status = '已经读过啦~\(≧▽≦)/~';
                    } else {
                        let target = e.target;
                        if(target.scrollHeight - target.clientHeight === target.scrollTop) {
                            // Read over
                            Post.update({feed_id: scope.vm.currentPost.feed_id, id: scope.vm.currentPost._id}, {
                                type: 'read'
                            });
                            storage.status = '读完啦~\(≧▽≦)/~';
                        }
                    }
                }, 200);
                angular.element(elem).on('scroll', func);
                console.log(angular.element(elem));
            }
        }
    }

}());