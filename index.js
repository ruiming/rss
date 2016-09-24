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

app.use(convert(serve(path.resolve(__dirname, 'public'), {defer: true})));

// 全局错误处理
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.log(`发生了一个错误`);
        console.log(err);
        ctx.status = (err && err.status) || 500;
        if(err === null)    ctx.body = { success: false, message: '???'};
        else    ctx.body = { success: false, message: err.toString()};
    }
});

// 后端视图处理 (Unprotected)
app.use(handel.routes())
   .use(handel.allowedMethods());

// Below needs JWT verfiy
app.use(jwt({ secret: config.app.secretKey, algorithm: 'RS256' }).unless({ path: [/^\/css|js|img|fonts/] }));

// API (Protected)
app.use(api.routes())
   .use(api.allowedMethods());

app.listen(3000);
