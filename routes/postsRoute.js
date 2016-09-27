import Router from 'koa-router';
import postsController from '../controllers/postsController';

var router = new Router();

router.get('/', postsController.list);

export default router;
