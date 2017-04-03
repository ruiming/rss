import Koa from 'koa'
import jwt from 'koa-jwt'
import mongoose from 'mongoose'
import api from './routes/index'
import handel from './routes/handel'
import config from './config/config'
import onerror from './middlewares/onerror'
import xsrf from './middlewares/xsrf'
import cookies from './middlewares/cookies'
import nghtml5 from './middlewares/nghtml5'
import ua from './middlewares/ua'
import normal from './middlewares/normal'

mongoose.Promise = require('bluebird')
global.Promise = require('bluebird')

const app = new Koa()
app.use(onerror())

if (config.ENV === 'production') {
  mongoose.connect(`mongodb://${config.MONGODB.USER}:${config.MONGODB.PASSWORD}@${config.MONGODB.HOST}:${config.MONGODB.PORT}/${config.MONGODB.NAME}`)
} else {
  mongoose.connect(`mongodb://${config.MONGODB.HOST}:${config.MONGODB.PORT}/${config.MONGODB.NAME}`)
}

app.use(ua())
app.use(cookies())
app.use(normal())
app.use(xsrf())

app.use(handel.routes())
    .use(handel.allowedMethods())

// Below needs JWT verfiy
app.use(jwt({
  secret: config.APP.JWT_KEY,
  algorithm: 'RS256'
}).unless({
  path: [/^\/static|css|js|img|fonts|favicon|manifest/]
}))

// API (Protected)
app.use(api.routes())
    .use(api.allowedMethods())
app.use(nghtml5())
app.listen(config.PORT)
