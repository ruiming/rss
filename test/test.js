import mongoose from 'mongoose';
import config from '../config/config';

import UserModel from '../models/user';

mongoose.connect(`mongodb://${config.MongoDB.HOST}:${config.MongoDB.PORT}/${config.MongoDB.NAME}`);
mongoose.Promise = require('bluebird');

var should = require('chai').should();

/**
 * Model 测试
 */
describe(`测试 User Model:`, () => {

    before(done => {
        UserModel.create({
            email: 'test@test.com',
            username: 'test',
            password: 'test'
        }, done);
    });

    after(done => {
        UserModel.findOne({
            email: 'test@test.com',
            password: 'test'
        }).remove(done);
    });

    it(`成功查询用户信息： 使用正确邮箱和正确密码查询`, done => {
        UserModel.findOne({
            email: 'test@test.com',
            password: 'test'
        }, (err, user) => {
            user.should.be.a('object');
            done();
        })
    });
    it(`不能成功查询用户信息： 使用错误邮箱或错误密码`, done => {
        UserModel.findOne({
            email: 'test@test.com',
            password: 'wrongpassword'
        }, (err, user) => {
            should.not.exist(user);
            UserModel.create({
                email: 'wrongemail',
                password: 'test'
            }, (err, user) => {
                should.not.exist(user);
                done();
            })
        });
    });
    it(`不能成功新建： 使用已注册过的邮箱创建`, done => {
        UserModel.create({
            email: 'test@test.com',
            password: 'test'
        }, (err, user) => {
            should.not.exist(user);
            should.exist(err);
            done();
        })
    });
});