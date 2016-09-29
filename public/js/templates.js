;(function(){

'use strict';

angular.module('app').run(['$templateCache', function($templateCache) {

  $templateCache.put('feed/feed_tpl.html', '<div class="post-panel"><div class="sidebar list-group"><a class="post-select list-group-item" ui-sref="feed.post({id: post.feed_id, post_id: post._id})" data-ng-repeat="post in vm.posts | orderBy: \'pubdate\' : true" data-ng-click="vm.read(post)" data-ng-class="{true: \'active\', false: \'\'}[post.active]"><h2>{{::post.title}}</h2><img class="read" src="img/ic_done_black_24dp_1x.png" data-ng-if="post.read"> <span>{{::post.pubdate | toLocalString}}</span></a><div class="status-bar"><button class="posts btn btn-primary" data-ng-click="vm.readall()" data-ng-if="vm.feed.feeded">全部标记为已读 <span class="glyphicon glyphicon-ok"></span></button> <button class="posts btn btn-primary" data-ng-click="vm.feedit()" data-ng-if="!vm.feed.feeded">立即订阅 <span class="glyphicon glyphicon-ok"></span></button></div></div><div ui-view class="center" scroll-listen="post.read"><div class="page-header"><h1>{{::vm.feed.title}}</h1></div><feed-panel feed="vm.feed"></feed-panel><div class="container-fluid"><div class="row"><div class="col-md-12 graphy"><nvd3 options="vm.options" data="vm.data"></nvd3></div></div></div><div class="status-bar"><p class="title">{{ ::vm.feed.title }}</p></div></div></div>');

  $templateCache.put('home/home_tpl.html', '<div><div class="col-md-8"><div class="col-xs-12 graphy"><p>用户阅读情况</p></div><div class="col-xs-12 graphy"><p>最新公告</p></div></div><div class="col-md-4"><div class="hidden-sm col-md-12 graphy"><p>订阅源推荐</p></div></div></div>');

  $templateCache.put('post/post_tpl.html', '<article class="markdown-body"><header><h1>{{::vm.currentPost.title}}</h1></header><section><small><span class="glyphicon glyphicon-send"></span> <span data-ng-if="vm.currentPost.pubdate">更新于 {{::vm.currentPost.pubdate | timeago}}</span> <span data-ng-if="vm.currentPost.author">由 {{::vm.currentPost.author}} 发布</span></small> <small data-ng-show="vm.currentPost.categories.length"><span class="glyphicon glyphicon-tags"></span> {{::vm.currentPost.categories.toString()}}</small></section><section><article data-ng-bind-html="::vm.currentPost.description | linkFix: vm.currentPost.link"></article></section><footer class="status-bar"><button class="home btn btn-primary" data-ng-click="vm.home()"><span class="glyphicon glyphicon-home"></span></button><p class="title">{{ ::vm.currentPost.title }}</p><p class="readtime" data-ng-if="vm.begintime"><span class="glyphicon glyphicon-time"></span> {{ vm.currenttime - vm.begintime | date: \'mm:ss\' }}</p><button class="mark btn btn-primary" data-ng-click="vm.mark()"><span data-ng-if="!vm.currentPostDetail.mark">收藏</span> <span data-ng-if="vm.currentPostDetail.mark">已收藏</span></button> <button class="love btn btn-primary" data-ng-click="vm.love()"><span data-ng-if="!vm.currentPostDetail.love">点赞</span> <span data-ng-if="vm.currentPostDetail.love">已点赞</span></button><p class="status" data-ng-if="vm.status">{{ ::vm.status }}</p></footer></article>');

  $templateCache.put('posts/posts_tpl.html', '<div class="post-panel"><div class="sidebar list-group"><a class="post-select list-group-item" data-ng-repeat="post in vm.posts | orderBy: \'pubdate\' : true" data-ng-class="{true: \'active\', false: \'\'}[post.active]" data-ng-click="vm.goto(post)"><h2>{{::post.title}}</h2><img class="read" src="img/ic_done_black_24dp_1x.png" data-ng-if="post.read === true && vm.type === \'未读\'"> <span>{{::post.pubdate | toLocalString}}</span></a><div class="status-bar"><button class="posts btn btn-primary" data-ng-click="vm.readall()" data-ng-if="vm.type === \'未读\'"><span class="glyphicon glyphicon-ok"></span> 全部标记为已读 <span>( {{vm.count}} )</span></button></div></div><div ui-view class="center" scroll-listen="post.read"><div class="page-header"><h1>{{vm.type}}文章 <strong>{{vm.count}}</strong> 篇</h1></div></div></div>');

  $templateCache.put('search/search_tpl.html', '<div class="search-panel container-fluid"><div class="searching" data-ng-if="!vm.err"><p class="lead">搜索中...</p><small>订阅源第一次被搜索时会比较久，请耐心等待...</small></div><div class="alert alert-danger" role="alert" data-ng-if="vm.err">{{vm.err}}</div></div>');

  $templateCache.put('contextMenu/contextMenu.html', '<div class="context-menu"><div class="user-avatar"><img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT3UXAsRhkm48myLgFQxVZli_HLmzJ-vTrCpoo-izKNi9GzLPeQBpbSj7Q"> <span>哈哈哈哈哈</span></div><div class="list-group"><a href="#" class="list-group-item"><span class="glyphicon glyphicon-globe"></span> 仪表盘</a> <a ui-sref="posts({type: \'unread\'})" class="list-group-item"><span class="glyphicon glyphicon-list"></span> 未读文章</a> <a ui-sref="posts({type: \'mark\'})" class="list-group-item"><span class="glyphicon glyphicon-star"></span> 星标文章</a></div><div class="list-group"><h2>订阅源</h2></div><div class="list-group"><a class="list-group-item feed-item" ui-sref="feed({id: feed.feed_id})" data-ng-click="vm.setTitle()" data-ng-repeat="feed in vm.feeds track by feed.feed_id"><img class="favicon" onerror="this.src=\'/img/rss.png\';" data-ng-src="{{feed.favicon}}"> <span class="title">{{feed.title}}</span> <span class="badge" data-ng-if="feed.unread">{{feed.unread}}</span></a></div><div class="status-bar"><p class="time"><span class="glyphicon glyphicon-calendar"></span> {{ vm.time | date: \'EEEE yyyy-MM-dd HH:mm:ss a\' }}</p></div></div>');

  $templateCache.put('feedPanel/feedPanel.html', '<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title">订阅源信息</h3><button class="btn btn-primary" data-ng-if="feed.feeded === true" data-ng-click="vm.feedit()">已订阅</button> <button class="btn btn-primary" data-ng-if="feed.feeded === false" data-ng-click="vm.feedit()">未订阅</button></div><div class="panel-body"><div class="row"><p class="col-sm-2">订阅源标题</p><p class="col-sm-10">{{feed.title}}</p></div><div class="row"><p class="col-sm-2">作者</p><p class="col-sm-10">{{feed.author}}</p></div><div class="row"><p class="col-sm-2">本周文章</p><p class="col-sm-10">TODO</p></div><div class="row"><p class="col-sm-2">最近更新时间</p><p class="col-sm-10">{{feed.pubdate | toLocalString}}</p></div><div class="row"><p class="col-sm-2">订阅人数</p><p class="col-sm-10">{{feed.feedNum}}</p></div><div class="row"><p class="col-sm-2">订阅源网站</p><p class="col-sm-10">{{feed.link}}</p></div><div class="row"><p class="col-sm-2">XML 地址</p><p class="col-sm-10">{{feed.absurl}}</p></div></div></div>');

  $templateCache.put('navbar/navbar.html', '<nav class="rssnav navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="#">Rss</a></div><form name="form" class="search"><div class="search-btn btn btn-default" data-ng-click="vm.search(feedlink)" data-ng-mouseover="vm.focus()"><input class="search-wrap" type="submit" value> <span class="glyphicon glyphicon-search"></span></div><input type="url" id="search" class="form-control" name="input" placeholder="输入 URL 添加订阅源" autocomplete="off" data-ng-class="{true: \'input-active\', false: \'\'}[vm.active]" data-ng-model="feedlink" data-ng-focus="vm.focus()" data-ng-blur="vm.blur()" data-ng-keypress="$event.which === 13 ? vm.search(feedlink) : \'\'"></form><div class="collapse navbar-collapse" id="navbar-collapse"><ul class="nav navbar-nav"><li><a href="#">A Link</a></li><li><a href="#">Another Link</a></li><li><a href="#">Another Link</a></li><li><a href="#">Another Link</a></li></ul></div></div></nav>');

}]);

})();