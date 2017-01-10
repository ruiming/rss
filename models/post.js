import mongoose from 'mongoose'
const Schema = mongoose.Schema

// 文章表

const PostSchema = new Schema({
  title:       { type: String },
  description: { type: String },
  summary:     { type: String },
  date:        { type: Date },
  pubdate:     { type: Date },
  link:        { type: String },
  guid:        { type: String },
  author:      { type: String },
  comments:    { type: String },
  origlink:    { type: String },
  categories:  { type: Array },

  website: { type: String },
  feed_id: [{ type: Schema.Types.ObjectId, ref: 'Feed' }],   // 订阅源 ID
  loveNum: { type: Number, default: 0 },                     // 点赞数量
  markNum: { type: Number, default: 0 },                      // 星标人数
})

const Post = mongoose.model('Post', PostSchema)

module.exports = Post
