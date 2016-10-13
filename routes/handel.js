import Router from 'koa-router';
import send from 'koa-send';
import jwt from 'jsonwebtoken';
import authRoute from './authRoute';
import config from '../config/config';

var router = new Router();

router.get(['/', '/login'], async (ctx, next) => {
    // If visitor is login, let it alone  to Angular big brother
    if(ctx.cookies.get('jwt') && jwt.verify(ctx.cookies.get('jwt'), config.app.secretKey)) {
        await send(ctx, './public/index.html');
    } else {
        await ctx.render('login.ejs', {test: 'Hey, this page is render by ejs'});  
    }
});

router.get('/register', async (ctx, next) => {
    // If visitor is login, let it alone  to Angular big brother
    if(ctx.cookies.get('jwt') && jwt.verify(ctx.cookies.get('jwt'), config.app.secretKey)) {
        await send(ctx, './public/index.html');
    } else {
        await ctx.render('register.ejs');  
    }
})

// Login & Register
router.use('/auth', authRoute.routes(), authRoute.allowedMethods());

export default router;
