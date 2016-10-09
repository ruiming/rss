import mongoose from 'mongoose';
var Schema = mongoose.Schema;

// 用户订阅源表

const UserFeedSchema = new Schema({ 
    feed_id:        [{type: Schema.Types.ObjectId, ref: 'Feed'}],   // 订阅源 ID
    user_id:        [{type: Schema.Types.ObjectId, ref: 'User'}],   // 用户 ID

    folder:         {type: String, default: 'default'},
    own_title:      {type: String},
    feed_time:      {type: Date, default: Date.now()}
});

var UserFeed = mongoose.model('UserFeed', UserFeedSchema);

module.exports = UserFeed;
