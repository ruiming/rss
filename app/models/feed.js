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

    feeder:         {type: Number, default: 0}
});

var Feed = mongoose.model('Feed', FeedSchema);

module.exports = Feed;
