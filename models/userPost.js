import mongoose from 'mongoose';
let Schema = mongoose.Schema;

// 用户订阅源文章表

const UserPostSchema = new Schema({ 
    feed_id:        [{type: Schema.Types.ObjectId, ref: 'Feed'}],   // 文章订阅源 ID
    user_id:        [{type: Schema.Types.ObjectId, ref: 'User'}],   // 用户 ID
    post_id:        [{type: Schema.Types.ObjectId, ref: 'Post'}],   // 文章 ID

    mark:           {type: Boolean, default: false},    // 星标情况
    love:           {type: Boolean, default: false},    // 点赞情况
    read:           {type: Boolean, default: false},    // 是否已读(标记)
    read_date:      {type: Date},   // 阅读完的时间
    love_date:      {type: Date},   // 点赞时间
    mark_date:      {type: Date}    // 收藏时间
});

const UserPost = mongoose.model('UserPost', UserPostSchema);

module.exports = UserPost;
