import Router from 'koa-router';
import feedRoute from './feedRoute';

var router = new Router({
    prefix: '/api'
});

router.get('/', (ctx, next) => {
   ctx.render('index');
});

router.use('/feed', feedRoute.routes(), feedRoute.allowedMethods());

export default router;