;(function(){

'use strict';

angular.module('app').run(['$templateCache', function($templateCache) {

  $templateCache.put('feed/feed_tpl.html', '<div class="post-panel"><article><header><h2>{{vm.posts[0].title}}</h2></header><section><span>{{vm.posts[0].author}}</span> <span>{{vm.posts[0].pubdate}}</span></section><section><article ng-bind-html="vm.posts[0].description"></article></section><footer></footer></article></div>');

  $templateCache.put('home/home_tpl.html', '');

  $templateCache.put('contextMenu/contextMenu.html', '<div class="context-menu"><div class="user-avatar"><img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT3UXAsRhkm48myLgFQxVZli_HLmzJ-vTrCpoo-izKNi9GzLPeQBpbSj7Q"> <span>哈哈哈哈哈</span></div><div class="list-group"><a href="#" class="list-group-item"><span class="glyphicon glyphicon-globe"></span> 仪表盘</a> <a href="#" class="list-group-item"><span class="glyphicon glyphicon-list"></span> 全部文章</a> <a href="#" class="list-group-item"><span class="glyphicon glyphicon-star"></span> 星标文章</a> <a href="#" class="list-group-item"><span class="glyphicon glyphicon-tower"></span> 朋友圈</a></div><div class="list-group"><h2>订阅源</h2></div><div class="list-group"><a class="list-group-item" ui-sref="feed({id: feed._id})" ng-repeat="feed in feeds track by $index">{{feed.title}}</a></div></div>');

  $templateCache.put('navbar/navbar.html', '<nav class="rssnav navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="#">Rss</a><div class="rss-title"><p>{{title}}</p></div></div><div class="collapse navbar-collapse" id="navbar-collapse"><ul class="nav navbar-nav"><li><a href="#">Link</a></li><li><a href="#">Another Link</a></li><li><a href="#">Another Link</a></li><li><a href="#">Another Link</a></li></ul></div></div></nav>');

}]);

})();