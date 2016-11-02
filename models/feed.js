import mongoose from 'mongoose'
let Schema = mongoose.Schema

// 订阅表

const FeedSchema = new Schema({
    xml:         {type: String},
    type:        {type: String},
    version:     {type: String},
    title:       {type: String},
    description: {type: String},
    date:        {type: Date},
    pubdate:     {type: Date},
    link:        {type: String},
    xmlurl:      {type: String},
    absurl:      {type: String},
    author:      {type: String},
    langulage:   {type: String},
    favicon:     {type: String},
    copyright:   {type: String},
    generator:   {type: String},
    categories:  {type: String},

    feedNum:  {type: Number, default: 0},         // 订阅人数
    lastScan: {type: Date, defaukt: Date.now()}   // 上次扫描时间
})
 
const Feed = mongoose.model('Feed', FeedSchema)

module.exports = Feed
