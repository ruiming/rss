import Router from 'koa-router';

var router = new Router();

router.get('/', (ctx, next) => {
   ctx.body = {test: '123'};
});

export default router;