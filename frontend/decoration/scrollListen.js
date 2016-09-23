(function() {
    angular
        .module('app')
        .directive('scrollListen', scrollListen);
    
    function scrollListen(_, Post, storage) {
        return {
            restrict: 'EA',
            scope: true,
            link: (scope, elem, attrs) => {
                var func = _.throttle(e => {
                    if(!scope.vm.currentPostDetail.finish) {
                        let target = e.target;
                        if(target.scrollHeight - target.clientHeight === target.scrollTop) {
                            // Read over
                            Post.update({feed_id: scope.vm.currentPost.feed_id, id: scope.vm.currentPost._id}, {
                                type: 'finish'
                            });
                            storage.status = '读完啦~\(≧▽≦)/~';
                        }
                    }
                }, 200);
                // 如果没有滚动条的话，则立即标为读完
                setTimeout(() => {
                    if(!scope.vm.currentPostDetail.finish) {
                        if(angular.element(elem[0].scrollHeight)[0] === angular.element(elem[0].offsetHeight)[0]) {
                            Post.update({feed_id: scope.vm.currentPost.feed_id, id: scope.vm.currentPost._id}, {
                                type: 'finish'
                            });
                            storage.status = '读完啦~\(≧▽≦)/~';
                        }
                    }
                }, 0);
                
                
                // TODO: if there is no scroll bar...
                // TODO: The first time load...
            }
        }
    }

}());