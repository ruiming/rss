import Koa from 'koa';
import path from 'path';
import router from './app/routes/index';
import mongoose from 'mongoose';
import config from './config/config';
import convert from 'koa-convert';
import Bodyparser from 'koa-bodyparser';
import Koaerror from 'koa-onerror';
import logger from 'koa-logger';
import serve from 'koa-static';

var app = new Koa();
var bodyparser = new Bodyparser();

mongoose.Promise = require('bluebird');
global.Promise = require('bluebird');

mongoose.connect(`mongodb://${config.MongoDB.HOST}:${config.MongoDB.PORT}/${config.MongoDB.NAME}`);

app.use(convert(serve(path.resolve(__dirname, 'public'))))

app.use(convert(bodyparser));
app.use(convert(logger()))

// 全局错误处理
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.body = { success: false, message: err.toString()};
        ctx.status = err.status || 500;
    }
});

/* 
convert(Koaerror)(app);

app.on('error', (err, ctx) => {
    ctx.body = { success: false, message: err.toString()};
    ctx.status = 400;
});
*/ 
app.use(router.routes())
   .use(router.allowedMethods())
   .listen(3000);
