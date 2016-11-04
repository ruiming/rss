(function () {
    angular
        .module('app')
        .controller('FeedController', FeedController)

    function FeedController($rootScope, feed, posts, _, storage, $scope, Post, $state, Feed, $stateParams, Posts) {
        var vm = this
        vm.expand = false
        vm.feed = feed.data
        vm.feed.feeded = angular.isDefined(feed.data.feed_time)
        vm.feed.feed_id = $stateParams.id
        vm.posts = posts.data
        vm.unread = vm.feed.unread

        // Graphy Start 订阅源文章更新情况
        vm.options = {
            chart: {
                type:   'discreteBarChart',
                height: 320,
                margin: {
                    top:    10,
                    right:  20,
                    bottom: 50,
                    left:   55
                },
                x(d) {
                    return d.label
                },
                y(d) {
                    return d.value
                },
                showValues: true,
                valueFormat(d) {
                    return d3.format(',.0f')(d)
                },
                duration: 500,
                xAxis:    {
                    axisLabel: '月份'
                },
                yAxis: {
                    axisLabel:         '最近更新文章数',
                    axisLabelDistance: -10
                },
                tooltip: {
                    valueFormatter(d) {
                        return d + '篇'
                    }
                }
            }
        }
        vm.data = [{
            key:    '最近更新文章数',
            values: []
        }]
        _.each(_.groupBy(posts.data, 'pubdate'), (value, key) => {
            let date = key.slice(0, 7),
                exist = false
            _.each(vm.data[0].values, (value) => {
                if (value.label === date) {
                    value.value++
                    exist = true
                }
            })
            if (!exist) {
                vm.data[0].values.push({
                    label: date,
                    value: 1
                })
            }
        })
        vm.data[0].values = _.sortBy(vm.data[0].values, 'label').reverse()
        // Graphy End

        // Function
        vm.read = read
        vm.readall = readall
        vm.feedit = feedit

        function feedit() {
            Feed.save({
                feedlink: vm.feed.absurl
            }, () => {
                vm.feed.feeded = true
                $rootScope.$broadcast('ADD_FEED', vm.feed)
                vm.feed.feedNum++
            }, err => {
                // TODO
                console.log(err)
            })
        }

        function read(post) {
            for (let post of vm.posts) {
                post.active = false
            }
            post.active = true
            if (!post.read) {
                vm.unread--
                post.read = true
                $rootScope.$broadcast('READ_POST', post.feed_id[0])
                Post.update({
                    id: post._id
                }, {
                    type: 'read'
                })
            }
        }

        function readall() {
            for (let post of vm.posts) {
                if (!post.read) {
                    $rootScope.$broadcast('READ_POST', vm.feed.feed_id)
                }
                post.read = true
            }
            Posts.update({
                feed_id: $stateParams.id,
                type:    'read'
            })
        }
        $scope.$on('EXPAND', () => vm.expand = !vm.expand)
        $scope.$on('FOLD', () => vm.expand = false)
    }
}())
