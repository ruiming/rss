import fs from 'fs'
import { SHA256 } from 'crypto-js'
import _ from 'underscore'

// TODO Docker Test
module.exports = {
    ENV:     'development',
    PORT:    80,
    MONGODB: {
        PORT:     process.env.MONGODB_PORT || 27017,
        HOST:     process.env.MONGODB_HOST || 'localhost',
        USER:     process.env.MONGODB_USERNAME || 'root',
        PASSWORD: process.env.MONGODB_PASSWORD || 'root',
        NAME:     process.env.MONGODB_DB || 'rss'
    },
    APP: {
        JWT_KEY:  SHA256(_.random(999999)).toString(),
        SSL_KEY:  null,
        SSL_CERT: null,
        CA:       null
    }
}
