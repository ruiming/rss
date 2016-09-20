;(function(){

'use strict';

angular.module('app').run(['$templateCache', function($templateCache) {

  $templateCache.put('feed/feed_tpl.html', '<div class="post-panel"><div class="sidebar"><div class="post-select" ng-repeat="post in vm.posts" ui-sref="feed.post({id: post.feed_id, post_id: post._id})"><h2>{{post.title}}</h2><span>{{post.pubdate | toLocalString}}</span></div></div><div ui-view class="center"></div></div>');

  $templateCache.put('home/home_tpl.html', '');

  $templateCache.put('post/post_tpl.html', '<article><header><h1>{{vm.currentPost.title}}</h1></header><section><span>{{vm.currentPost.author}}</span> <span>{{vm.currentPost.pubdate | toLocalString}}</span></section><section><article ng-bind-html="vm.currentPost.description"></article></section><footer></footer></article>');

  $templateCache.put('contextMenu/contextMenu.html', '<div class="context-menu"><div class="user-avatar"><img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT3UXAsRhkm48myLgFQxVZli_HLmzJ-vTrCpoo-izKNi9GzLPeQBpbSj7Q"> <span>哈哈哈哈哈</span></div><div class="list-group"><a href="#" class="list-group-item"><span class="glyphicon glyphicon-globe"></span> 仪表盘</a> <a href="#" class="list-group-item"><span class="glyphicon glyphicon-list"></span> 全部文章</a> <a href="#" class="list-group-item"><span class="glyphicon glyphicon-star"></span> 星标文章</a> <a href="#" class="list-group-item"><span class="glyphicon glyphicon-tower"></span> 朋友圈</a></div><div class="list-group"><h2>订阅源</h2></div><div class="list-group"><a class="list-group-item" ui-sref="feed({id: feed._id})" ng-repeat="feed in feeds track by $index">{{feed.title}}</a></div></div>');

  $templateCache.put('navbar/navbar.html', '<nav class="rssnav navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="#">Rss</a><div class="rss-title"><p>{{title}}</p></div></div><div class="collapse navbar-collapse" id="navbar-collapse"><ul class="nav navbar-nav"><li><a href="#">Link</a></li><li><a href="#">Another Link</a></li><li><a href="#">Another Link</a></li><li><a href="#">Another Link</a></li></ul></div></div></nav>');

}]);

})();