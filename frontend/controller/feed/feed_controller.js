(function() {
    angular
        .module('app')
        .controller('FeedController', FeedController);

    function FeedController($rootScope, feed, posts, _, storage, $scope, Post, $state, Feed, $stateParams) {
        var vm = this;
        vm.feed = feed.data;
        vm.feed.feeded = angular.isDefined(feed.data.feed_time);        
        vm.feed.feed_id = $stateParams.id;        
        vm.posts = posts.data.posts;
        vm.detail = _.groupBy(posts.data.detail, 'post_id');

        // Graphy Start 订阅源文章更新情况
        vm.options = {
            chart: {
                type: 'discreteBarChart',
                height: 380,
                margin : {
                    top: 30,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',.0f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: '月份'
                },
                yAxis: {
                    axisLabel: '月更新文章数',
                    axisLabelDistance: -10
                }
            }
        }
        vm.data = [{
            key: "kkkk",
            values: []
        }]
        _.each(_.groupBy(posts.data.posts, 'pubdate'), (value, key) => {
            let date = key.slice(0, 7), exist = false;
            _.each(vm.data[0].values, (value, key) => {
                if(value.label === date) {
                    value.value ++;
                    exist = true;
                }
            });
            if(!exist)  vm.data[0].values.push({label: date, value: 1})
        })
        // Graphy End

        // Function
        vm.read = read;
        vm.readall = readall;
        vm.feedit = feedit;

        // Will be used by its' child state
        $state.current.data = feed.data.link;
        
        // get the status of each post
        for(let post of vm.posts) {
            if(vm.detail[post._id] && vm.detail[post._id][0].read) {
                post.read = true;
            }
        }
        
        function feedit() {
            Feed.save({feedlink: vm.feed.absurl}, res => {
                vm.feed.feeded = true;
                $rootScope.$broadcast('ADD_FEED', vm.feed);
                vm.feed.feedNum ++;
            }, err => {
                // TODO
                console.log(err);
            });
        }
        function read(post) {
            for(let post of vm.posts) {
                post.active = false;
            }
            post.active = true;
            if(post.read) {
                return;
            } else {
                post.read = true;
                $rootScope.$broadcast('READ_POST', post.feed_id[0]);
                Post.update({feed_id: post.feed_id[0], id: post._id}, {type: 'read'});
            }
        }
        function readall() {
            for(let post of vm.posts) {
                console.log(post.read);
                if(!post.read) $rootScope.$broadcast('READ_POST', vm.feed.feed_id);
                post.read = true;
            }
            Post.update({feed_id: vm.feed.feed_id, id: 0}, {type: 'read'});
        }
    }
}());
