import Koa from 'koa';
import path from 'path';
import api from './routes/index';
import handel from './routes/handel';
import config from './config/config';
import mongoose from 'mongoose';
import convert from 'koa-convert';
import Bodyparser from 'koa-bodyparser';
import serve from 'koa-static';
import views from 'koa-views';
import jwt from 'koa-jwt';
import render from 'koa-ejs';
import json from 'koa-json';
import favicon from 'koa-favicon';
import compress from 'koa-compress';
import http from 'http';
import http2 from 'http2';
import enforceHttps from 'koa-sslify';
import enforceWww from './middlewares/enforce-www';
import onerror from './middlewares/onerror';
import xsrf from './middlewares/xsrf';
import cookies from './middlewares/cookies';

mongoose.connect(`mongodb://${config.MONGODB.HOST}:${config.MONGODB.PORT}/${config.MONGODB.NAME}`);
mongoose.Promise = require('bluebird');
global.Promise = require('bluebird');

var app = new Koa();
var bodyparser = new Bodyparser();

if(config.ENV === 'production') {
    app.use(enforceHttps());
    app.use(enforceWww());
}

app.use(cookies());
app.use(compress({
    filter: content_type => /text|application/i.test(content_type),
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}));
app.use(json());
app.use(convert(bodyparser));
app.use(convert(logger()))
app.use(views(__dirname + '/views', {
  extension: 'ejs'
}));
app.use(convert(serve(path.resolve(__dirname, 'public'), {defer: true})));
app.use(favicon(__dirname + '/public/img/rss.png'));
app.use(xsrf());
app.use(onerror());

// 后端视图处理 (Unprotected)
app.use(handel.routes())
   .use(handel.allowedMethods());

// Below needs JWT verfiy
app.use(jwt({ secret: config.APP.JWT_KEY, algorithm: 'RS256' }).unless({ path: [/^\/css|js|img|fonts/] }));

// API (Protected)
app.use(api.routes())
   .use(api.allowedMethods());

http.createServer(app.callback()).listen(config.PORT);
// Production Only
if(config.ENV === 'production') {
    const options = { key: config.APP.SSL_KEY, cert: config.APP.SSL_CERT }; 
    http2.createServer(options, app.callback()).listen(443);
}

