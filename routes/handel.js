import Router from 'koa-router';
import send from 'koa-send';

var router = new Router();

router.get('/', async (ctx, next) => {
    // Depend on whether visitor is login...
    if(Date.now() % 2 === 0) {
        await ctx.render('index.ejs', {test: 123});  
    } else {
        await send(ctx, './public/index.html');
    }
});
router.get('/auth', async (ctx, next) => {
    console.log('222');
    await ctx.render('auth.ejs', {test: 123});
})

export default router;