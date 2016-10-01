(function() {
    angular
        .module('app')
        .directive('scrollListen', scrollListen);
    
    function scrollListen(_, Post, storage) {
        return {
            restrict: 'EA',
            scope: true,
            link: (scope, elem, attrs) => {
                var first = true;
                var func = _.throttle(e => {
                    if(void 0 !== scope.vm.currentPostDetail && null !== scope.vm.currentPostDetail && !scope.vm.currentPostDetail.finish) {
                        let target = e.target;
                        // 100px 偏差
                        if(first && target.scrollHeight - target.clientHeight - 100 < target.scrollTop) {
                            // Read over
                            Post.update({feed_id: scope.vm.currentPost.feed_id, id: scope.vm.currentPost._id}, {
                                type: 'finish'
                            });
                            first = false;
                            scope.vm.status = '读完啦~\(≧▽≦)/~';
                        }
                    }
                }, 200);
                angular.element(elem).on('scroll', func);
                // 如果没有滚动条的话，则立即标为读完
                setTimeout(() => {
                    if(void 0 !== scope.vm.currentPostDetail && null !== scope.vm.currentPostDetail && !scope.vm.currentPostDetail.finish) {
                        if(angular.element(elem[0].scrollHeight)[0] === angular.element(elem[0].offsetHeight)[0]) {
                            Post.update({feed_id: scope.vm.currentPost.feed_id, id: scope.vm.currentPost._id}, {
                                type: 'finish'
                            });
                            scope.vm.status = '读完啦~\(≧▽≦)/~';
                        }
                    }
                }, 0);
            }
        }
    }

}());