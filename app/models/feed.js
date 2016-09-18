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
    author:         {type: String},
    langulage:      {type: String},
    favicon:        {type: String},
    copyright:      {type: String},
    generator:      {type: String},
    categories:     {type: String},
});

var Feed = mongoose.model('Feed', FeedSchema);

module.exports = Feed;
