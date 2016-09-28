import Router from 'koa-router';
import postsController from '../controllers/postsController';

var router = new Router();

router.get('/', postsController.list);
router.post('/', postsController.update);

export default router;
