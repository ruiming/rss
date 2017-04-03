import compose from 'koa-compose'
import json from 'koa-json'
import convert from 'koa-convert'
import bodyparser from 'koa-bodyparser'
import logger from 'koa-logger'
import serve from 'koa-static'
import views from 'koa-views'
import path from 'path'
import favicon from 'koa-favicon'
import conditional from 'koa-conditional-get'

const normal = () => compose([
  conditional(),
  json(),
  convert(bodyparser()),
  convert(logger()),
  convert(serve(path.resolve(__dirname, '../public'), {
    defer: true
  })),
  views(path.resolve(__dirname, '../views'), {
    extension: 'ejs'
  }),
  favicon(path.resolve(__dirname, '../public/img/rss.png'))
])

export default normal
