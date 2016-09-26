import Router from 'koa-router';
import send from 'koa-send';
import jwt from 'jsonwebtoken';
import userRoute from './userRoute';
import config from '../config/config';

var router = new Router();

router.get('/', async (ctx, next) => {
    // If visitor is login, let it alone  to Angular big brother
    if(ctx.cookies.get('jwt') && jwt.verify(ctx.cookies.get('jwt'), config.app.secretKey)) {
        await send(ctx, './public/index.html');
    } else {
        await ctx.render('index.ejs', {test: 'Hey, this page is render by ejs'});  
    }
});

router.get('/auth', async (ctx, next) => {
    // If visitor is login, let it alone  to Angular big brother
    if(ctx.cookies.get('jwt') && jwt.verify(ctx.cookies.get('jwt'), config.app.secretKey)) {
        await send(ctx, './public/index.html');
    } else {
        await ctx.render('auth.ejs');  
    }
})

// Login & Register
router.use('/auth', userRoute.routes(), userRoute.allowedMethods());

export default router;
