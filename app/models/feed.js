import mongoose from 'mongoose';
var Schema = mongoose.Schema;

// 订阅表

const FeedSchema = new Schema({ 
    xml:            {type: String},
    type:           {type: String},
    version:        {type: String},
    title:          {type: String},
    description:    {type: String},
    date:           {type: Date},
    pubdate:        {type: Date},
    link:           {type: String},
    xmlurl:         {type: String},
    absurl:         {type: String},
    author:         {type: String},
    langulage:      {type: String},
    favicon:        {type: String},
    copyright:      {type: String},
    generator:      {type: String},
    categories:     {type: String},

    feeder:         {type: Number, default: 1},     // 订阅人数
    lastScan:       {type: Date},                   // 上次扫描时间
    frequency:      {type: Array}                   // 更新频率，每日更新文章数，存为数组
});

var Feed = mongoose.model('Feed', FeedSchema);

module.exports = Feed;
