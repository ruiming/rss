import { SHA256 } from 'crypto-js'
import _ from 'underscore'

module.exports = {
  ENV: 'production',
  PORT: 80,
  MONGODB: {
    PORT: process.env.MONGODB_PORT || 27017,
    HOST: process.env.MONGODB_HOST || 'localhost',
    USER: process.env.MONGODB_USERNAME || 'rss',
    PASSWORD: process.env.MONGODB_PASS || 'root',
    NAME: process.env.MONGODB_DB || 'rss'
  },
  APP: {
    JWT_KEY: SHA256(_.random(999999)).toString()
  }
}
