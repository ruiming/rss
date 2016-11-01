import FeedModel from '../models/feed'
import FeedParser from 'feedparser'
import request from 'request'
import help from '../helper/help'
import fetchFavicon from 'favicon-getter'
import config from '../config/config'
import mongoose from 'mongoose'
import process from 'process'
import _ from 'underscore'
import fs from 'fs'
import { SHA256 } from 'crypto-js'

mongoose.connect(`mongodb://${config.MONGODB.HOST}:${config.MONGODB.PORT}/${config.MONGODB.NAME}`)
mongoose.Promise = require('bluebird')
global.Promise = require('bluebird')

async function fetch() {
    let feeds = await FeedModel.find({}, {
        absurl: 1,
        favicon: 1,
        link: 1
    })
    let count = 0, number = feeds.length
    await Promise.all(_.map(feeds, feed => new Promise(async (resolve, reject) => {
        let url = null,
            hash = SHA256(feed.link).toString().slice(0,10)  
        await fetchFavicon(feed.absurl).then(data => url = data)
        request(url, (err, response, body) => {
            if (response && response.statusCode === 200 && /image/.test(response.headers['content-type'])) {
                // New Favicon
                request.get(url).pipe(fs.createWriteStream(__dirname + '/../public/favicon/' + hash + '.ico'))
                // Store it
                feed.favicon = `/favicon/${hash}.ico`
                feed.save()
                count++
            }
            resolve()
        })
    })))
    console.log(`${Date().toLocaleString()}-- 目前有 ${number} 个订阅源, 共更新 ${count} 个订阅源的 favicon`)
    process.exit()
}

fetch()