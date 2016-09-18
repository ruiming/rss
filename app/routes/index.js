import Router from 'koa-router';
import feedRoute from './feedRoute';

var router = new Router();

router.get('/', (ctx, next) => {
   ctx.body = {test: '123'};
});

router.use('/feed', feedRoute.routes(), feedRoute.allowedMethods());

export default router;