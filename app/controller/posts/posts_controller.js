(function() {
    angular
        .module('app')
        .controller('PostsController', PostsController);

    function PostsController(_, $stateParams, $scope, posts, $state, Post, Posts, $rootScope) {
        var vm = this;
        vm.posts = posts.data;
        vm.expand = false;
        vm.readall = readall;
        vm.randomcolor = randomcolor;
        vm.type = $stateParams.type === 'unread' ? "未读" : "星标";
        vm.unread = vm.posts.length;
        vm.postsByFeed = _.toArray(_.groupBy(posts.data, 'feed_id'));

        // Function
        vm.goto = goto;

        function goto(id) {
            var post = null;
            for(let item of vm.posts) {
                if(item._id === id) {
                    item.active = true;
                    post = item;
                } 
                else item.active = false;
            }
            if(!post.read && vm.type === '未读') {
                vm.unread --;
                if($stateParams.type === 'unread') {
                    $rootScope.$broadcast('READ_POST', post.feed_id);
                }
                post.read = true;
                Post.update({feed_id: post.feed_id, id: post._id}, {type: 'read'});
            }
            $state.current.data = post.feed_id;
            $state.go('posts.post', {id: post._id});
        }
        function readall() {
            var str = '';
            for(let post of vm.posts) {
                if(!post.read) {
                    $rootScope.$broadcast('READ_POST', post.feed_id);
                    vm.unread--;
                }
                post.read = true;                
                str += str === '' ? post._id : ',' + post._id;
            }
            Posts.save({id: str});
        }
        function randomcolor() {
            var random = Math.floor(Math.random() * 3);
            return  random === 0 ? 'warning' : random === 1 ? 'info' : random === 2 ? 'danger' : '';
        }
        $scope.$on('EXPAND', () => vm.expand = !vm.expand);
        $scope.$on('FOLD', () => vm.expand = false);
    }
}());
