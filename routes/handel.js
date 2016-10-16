import Router from 'koa-router';
import send from 'koa-send';
import jwt from 'jsonwebtoken';
import authRoute from './authRoute';
import config from '../config/config';
import UserModel from '../models/user';
import fs from 'fs';

var router = new Router();

router.get(['/', '/login'], async (ctx, next) => {
    // 如果用户正确授权，跳转 Angular
    // 如果 JWT 有误，跳转登录 
    if(ctx.cookies.get('jwt')) {
        let token = jwt.decode(ctx.cookies.get('jwt'));
        if(token.id) {
            let result = await UserModel.findById(token.id);
            if(result && result._id) await send(ctx, './public/index.html');
        } else {
            ctx.cookies.set('jwt', null, {overwrite: true, expires: new Date()});
            ctx.render('login.ejs', {err: 'JWT 验证失败'});
        }
    } else {
        await ctx.render('login.ejs');  
    }
});

router.get('/register', async (ctx, next) => {
    if(ctx.cookies.get('jwt') && jwt.verify(ctx.cookies.get('jwt'), config.app.secretKey)) {
        await send(ctx, './public/index.html');
    } else {
        await ctx.render('register.ejs');  
    }
})

// Update SSL only
router.get('/.well-known/acme-challenge/:id', (ctx, next) => {
    ctx.status = 200;
    ctx.type = 'text/plain; charset=utf-8';
    ctx.body = fs.readFileSync(__dirname + '/..' +  ctx.url);
});

// Login & Register
router.use('/auth', authRoute.routes(), authRoute.allowedMethods());

export default router;
