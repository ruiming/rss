import Koa from 'koa';
import path from 'path';
import api from './routes/index';
import handel from './routes/handel';
import config from './config/config';
import mongoose from 'mongoose';
import convert from 'koa-convert';
import Bodyparser from 'koa-bodyparser';
import Koaerror from 'koa-onerror';
import logger from 'koa-logger';
import serve from 'koa-static';
import views from 'koa-views';
import jwt from 'koa-jwt';
import co from 'co';
import render from 'koa-ejs';

mongoose.connect(`mongodb://${config.MongoDB.HOST}:${config.MongoDB.PORT}/${config.MongoDB.NAME}`);
mongoose.Promise = require('bluebird');
global.Promise = require('bluebird');

var app = new Koa();
var bodyparser = new Bodyparser();

app.use(convert(bodyparser));
app.use(convert(logger()))
app.use(views(__dirname + '/views', {
  extension: 'ejs'
}));

// 全局错误处理
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;            
        ctx.body = { success: false, message: err.toString()};
    }
});

// 后端视图处理
app.use(handel.routes())
   .use(handel.allowedMethods());

// 后端 API 提供
app.use(api.routes())
   .use(api.allowedMethods());

// This should not put in front of the router middleware
app.use(convert(serve(path.resolve(__dirname, 'public'))))

/****** JWT 处理 TODO ...
app.use(jwt({ secret: config.app.publicKey, algorithm: 'RS256' }));

app.use((ctx, next) => {
  if (this.url.match(/^\/api/)) {
      ctx.body = ctx;
  }
});
*/
// API

app.listen(3000);
