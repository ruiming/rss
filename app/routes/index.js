import Router from 'koa-router';
import feedRoute from './feedRoute';
import postRoute from './postRoute';
import userRoute from './userRoute';

var router = new Router();

router.get('/', (ctx, next) => {
   ctx.render('index');
});
router.use('/auth', userRoute.routes(), userRoute.allowedMethods());

export default router;