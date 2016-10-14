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
import json from 'koa-json';
import favicon from 'koa-favicon';
import compress from 'koa-compress';

mongoose.connect(`mongodb://${config.MongoDB.HOST}:${config.MongoDB.PORT}/${config.MongoDB.NAME}`);
mongoose.Promise = require('bluebird');
global.Promise = require('bluebird');

var app = new Koa();
var bodyparser = new Bodyparser();

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
// XSRF 检测，处理客户端未授权问题
app.use(async (ctx, next) => {
    let token = ctx.cookies.get('jwt'), xsrf = ctx.request.headers['x-xsrf-token'];
    ctx.request.header.authorization = 'Bearer ' + token;
    // 当 JWT 存在且访问 API 时，检测 XSRF 
    if(token !== void 0 && /^\/api\//.test(ctx.url)) {;
        let verify = Promise.promisify(jwt.verify);
        await verify(token, config.app.secretKey).then(async (data) => {
            if(xsrf !== data.xsrf) {
                ctx.cookies.set("XSRF-TOKEN", null, {overwrite: true, expires: new Date()});
                ctx.cookies.set("jwt", null, {overwrite: true, expires: new Date()});
                ctx.status = 401;
                ctx.body =  { success: false, message: '用户验证失败'};
            } else {
                await next();
            }
        }, err => {
            ctx.cookies.set("XSRF-TOKEN", null, {overwrite: true, expires: new Date()});
            ctx.cookies.set("jwt", null, {overwrite: true, expires: new Date()})
            ctx.status = 401;
            ctx.body = { success: false, message: '用户验证失败'};
        });
    } else {
        await next();
    }
});

// 全局错误处理，处理全局错误和登录注册错误问题
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if(401 === err.status) {
            ctx.cookies.set("jwt", null, {overwrite: true, expires: new Date()});
            ctx.cookies.set("XSRF-TOKEN", null, {overwrite: true, expires: new Date()});
            await ctx.render('login.ejs', {err: err, email: ctx.request.body.email});
        } else {
            ctx.status = (err && err.status) || 500;
            if(null === err || undefined === err) ctx.body = { success: false, message: 'Unknown' };
            else ctx.body = { success:false, message: err.toString()};
        }
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
