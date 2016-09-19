import Koa from 'koa';
import path from 'path';
import router from './app/routes/index';
import mongoose from 'mongoose';
import config from './config/config';
import convert from 'koa-convert';
import Bodyparser from 'koa-bodyparser';
import Koaerror from 'koa-onerror';

var app = new Koa();
var bodyparser = new Bodyparser();

mongoose.Promise = require('bluebird');
global.Promise = require('bluebird');

mongoose.connect(`mongodb://${config.MongoDB.HOST}:${config.MongoDB.PORT}/${config.MongoDB.NAME}`);

app.use(convert(bodyparser));

convert(Koaerror)(app);

app.on('error', (err, ctx) => {
    console.log('lalalala');
});
    
app.use(router.routes())
   .use(router.allowedMethods())
   .listen(3000);
