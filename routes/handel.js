import Router from 'koa-router'
import send from 'koa-send'
import jwt from 'jsonwebtoken'
import authRoute from './authRoute'
import config from '../config/config'
import UserModel from '../models/user'
import fs from 'fs'

var router = new Router()

router.get(['/', '/login'], async(ctx, next) => {
    if (ctx.cookies.get('jwt')) {
        let token = jwt.decode(ctx.cookies.get('jwt'))
        if (token.id) {
            let result = await UserModel.findById(token.id)
            if (result && result._id) {
                if (ctx.mobile) await send(ctx, './public/index.html')
                else await send(ctx, './public/pc.html')
            }
        } else {
            ctx.cookies.set('jwt', null, {
                overwrite: true,
                expires: new Date()
            })
            if (ctx.mobile) await send(ctx, './public/index.html')
            else await ctx.render('login.ejs', {
                err: 'JWT 验证失败'
            })
        }
    } else {
        if (ctx.mobile) await send(ctx, './public/index.html')
        else await ctx.render('login.ejs')
    }
})

router.get('/register', async(ctx, next) => {
    if (ctx.cookies.get('jwt') && jwt.verify(ctx.cookies.get('jwt'), config.APP.JWT_KEY)) {
        if (ctx.mobile) await send(ctx, './public/index.html')
        else await send(ctx, './public/pc.html')
    } else {
        if (ctx.mobile) await send(ctx, './public/index.html')
        else await ctx.render('register.ejs')
    }
})

// Update SSL only
router.get('/.well-known/acme-challenge/:id', (ctx, next) => {
    ctx.status = 200
    ctx.type = 'text/plain; charset=utf-8'
    ctx.body = fs.readFileSync(__dirname + '/..' + ctx.url)
})

// Login & Register
router.use('/auth', authRoute.routes(), authRoute.allowedMethods())

export default router