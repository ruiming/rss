import mongoose from 'mongoose';
var Schema = mongoose.Schema;

// 文章表

const PostSchema = new Schema({ 
    title:          {type: String},
    description:    {type: String},
    summary:        {type: String},
    date:           {type: String},
    pubdate:        {type: String},
    link:           {type: String},
    guid:           {type: String},
    author:         {type: String},
    comments:       {type: String},
    origlink:       {type: String},
    categories:     {type: Array},

    feed_id:        [{type: Schema.Types.ObjectId, ref: 'Feed'}]
});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;
