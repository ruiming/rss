import Koa from 'koa';
import path from 'path';
import router from './app/routes/index';
import mongoose from 'mongoose';

var app = new Koa();

app
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(3000);