import compose from 'koa-compose'
import compress from 'koa-compress'
import json from 'koa-json'
import convert from 'koa-convert'
import bodyparser from 'koa-bodyparser'
import logger from 'koa-logger'
import serve from 'koa-static'
import views from 'koa-views'
import path from 'path'
import favicon from 'koa-favicon'
import cacheControl from 'koa-cache-control'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import zlib from 'zlib'

const normal = () => compose([
  compress({
    filter:    contentType => /text|application/i.test(contentType),
    threshold: 2048,
    flush:     zlib.Z_SYNC_FLUSH,
  }),
  conditional(),
  etag(),
  json(),
  convert(cacheControl({
    maxAge: 2,
  })),
  convert(bodyparser()),
  convert(logger()),
  convert(serve(path.resolve(__dirname, '../public'), {
    defer: true,
  })),
  views(path.resolve(__dirname, '../views'), {
    extension: 'ejs',
  }),
  favicon(path.resolve(__dirname, '../public/img/rss.png')),
])

export default normal
