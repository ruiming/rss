import Koa from 'koa';
import path from 'path';
import router from './app/routes/index';
import mongoose from 'mongoose';
import config from './config/config';

var app = new Koa();

mongoose.Promise = require('bluebird');
global.Promise = require('bluebird');

mongoose.connect(`mongodb://${config.MongoDB.HOST}:${config.MongoDB.PORT}/${config.MongoDB.NAME}`);

app
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(3000);