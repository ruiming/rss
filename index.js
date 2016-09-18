import Koa from 'koa';
import path from 'path';
import router from './app/routes/index';
import mongoose from 'mongoose';
import config from './config/config';
import convert from 'koa-convert';
import Bodyparser from 'koa-bodyparser';

var app = new Koa();
var body2 = new body();
var bodyparser = new Bodyparser();

mongoose.Promise = require('bluebird');
global.Promise = require('bluebird');

mongoose.connect(`mongodb://${config.MongoDB.HOST}:${config.MongoDB.PORT}/${config.MongoDB.NAME}`);


app.use(convert(bodyparser));
    
app.use(router.routes())
   .use(router.allowedMethods())
   .listen(3000);
