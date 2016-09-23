;(function(){

'use strict';

angular.module('app').run(['$templateCache', function($templateCache) {

  $templateCache.put('feed/feed_tpl.html', '<div class="post-panel"><div class="sidebar list-group"><a class="post-select list-group-item" ng-repeat="post in vm.posts | orderBy: \'pubdate\' : true" ng-click="vm.read(post)" ui-sref="feed.post({id: post.feed_id, post_id: post._id})"><h2>{{post.title}}</h2><img ng-if="post.read" class="read" src="img/ic_done_black_24dp_1x.png"> <span>{{post.pubdate | toLocalString}}</span></a></div><div ui-view class="center" scroll-listen="post.read"><div class="page-header"><h1>{{vm.feed.title}}</h1></div><feed-panel feed="vm.feed"></feed-panel><div class="container-fluid"><div class="row"><div class="col-md-6 graphy"><p>更新频率图,最近一段时间的每天更新文章数，柱状图表示</p></div><div class="col-md-6 graphy"><p>用户阅读图，最近一段时间的阅读情况和阅读时间图标</p></div></div></div></div></div>');

  $templateCache.put('home/home_tpl.html', '<div class="container-fluid"><div class="row"><div class="col-md-8"><div class="col-xs-12 graphy"><p>用户阅读情况</p></div><div class="col-xs-12 graphy"><p>最新公告</p></div></div><div class="col-md-4"><div class="hidden-sm col-md-12 graphy"><p>订阅源推荐</p></div></div></div></div>');

  $templateCache.put('post/post_tpl.html', '<article class="markdown-body"><header><h1>{{vm.currentPost.title}}</h1></header><section><span>{{vm.currentPost.author}}</span> <span>{{vm.currentPost.pubdate | toLocalString}}</span></section><section><article ng-bind-html="vm.currentPost.description"></article></section><footer></footer></article>');

  $templateCache.put('contextMenu/contextMenu.html', '<div class="context-menu"><div class="user-avatar"><img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT3UXAsRhkm48myLgFQxVZli_HLmzJ-vTrCpoo-izKNi9GzLPeQBpbSj7Q"> <span>哈哈哈哈哈</span></div><div class="list-group"><a href="#" class="list-group-item"><span class="glyphicon glyphicon-globe"></span> 仪表盘</a> <a href="#" class="list-group-item"><span class="glyphicon glyphicon-list"></span> 全部文章</a> <a href="#" class="list-group-item"><span class="glyphicon glyphicon-star"></span> 星标文章</a> <a href="#" class="list-group-item"><span class="glyphicon glyphicon-tower"></span> 朋友圈</a></div><div class="list-group"><h2>订阅源</h2></div><div class="list-group"><a class="list-group-item" ui-sref="feed({id: feed.feed_id})" ng-click="setTitle()" ng-repeat="feed in feeds track by $index">{{feed.title}}</a></div></div>');

  $templateCache.put('feedPanel/feedPanel.html', '<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title">订阅源信息</h3></div><div class="panel-body container"><div class="row"><p class="col-sm-2">订阅源标题</p><p class="col-sm-10">{{feed.title}}</p></div><div class="row"><p class="col-sm-2">作者</p><p class="col-sm-10">{{feed.author}}</p></div><div class="row"><p class="col-sm-2">本周文章</p><p class="col-sm-10">TODO</p></div><div class="row"><p class="col-sm-2">最近更新时间</p><p class="col-sm-10">{{feed.pubdate | toLocalString}}</p></div><div class="row"><p class="col-sm-2">订阅人数</p><p class="col-sm-10">{{feed.feeder}}</p></div><div class="row"><p class="col-sm-2">订阅源网站</p><p class="col-sm-10">{{feed.link}}</p></div><div class="row"><p class="col-sm-2">XML 地址</p><p class="col-sm-10">{{feed.absurl}}</p></div></div></div>');

  $templateCache.put('navbar/navbar.html', '<nav class="rssnav navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="#">Rss</a><div class="rss-title"><p>{{title}}</p></div></div><div class="collapse navbar-collapse" id="navbar-collapse"><ul class="nav navbar-nav"><li><a href="#">Link</a></li><li><a href="#">Another Link</a></li><li><a href="#">Another Link</a></li><li><a href="#">Another Link</a></li></ul></div></div></nav>');

  $templateCache.put('statusBar/statusBar.html', '<div class="status-bar"><p class="time">{{ time | date: \'EEEE yyyy-MM-dd HH:mm:ss a\' }}</p><p class="title" ng-if="title">{{ title }}</p><p class="feed" ng-click="readall()">全部标记为已读</p><p class="readtime" ng-if="begintime">{{ time - begintime | date: \'mm:ss\' }}</p><p ng-if="status" class="status">{{ status }}</p></div>');

}]);

})();