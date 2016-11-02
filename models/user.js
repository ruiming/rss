import mongoose from 'mongoose'
let Schema = mongoose.Schema

// 用户表

const UserSchema = new Schema({
    username:    {type: String, required: true},
    email:       {type: String, required: true, unique: true},
    password:    {type: String, required: true},
    createdtime: {type: Date,   default: Date.now()},
    avatar:      {type: String}
})

const User = mongoose.model('User', UserSchema)
 
module.exports = User
