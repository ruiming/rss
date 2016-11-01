import fs from 'fs'
import { SHA256 } from 'crypto-js'
import _ from 'underscore'

module.exports = {
    ENV: 'production',
    PORT: 80,
    MONGODB: {
        PORT: 27017,
        HOST: "localhost",
        USER: "root",
        PASSWORD: "root",
        NAME: "rss"
    },
    APP: {
        JWT_KEY: SHA256(_.random(999999)).toString(),
        SSL_KEY: fs.readFileSync('/etc/letsencrypt/live/enjoyrss.com/privkey.pem'),
        SSL_CERT: fs.readFileSync('/etc/letsencrypt/live/enjoyrss.com/cert.pem'),
        CA: fs.readFileSync('/etc/letsencrypt/live/enjoyrss.com/chain.pem')
    }
}
