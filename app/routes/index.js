import Router from 'koa-router';
import feedRoute from './feedRoute';
import postRoute from './postRoute';
import userRoute from './userRoute';

var router = new Router({
    prefix: '/api'
});

router.get('/', (ctx, next) => {
   ctx.render('index');
});
router.use('/auth', userRoute.routes(), userRoute.allowedMethods());
router.use('/feed', feedRoute.routes(), feedRoute.allowedMethods());
router.use('/feed/:feed_id/post', postRoute.routes(), postRoute.allowedMethods());



export default router;