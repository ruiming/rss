import Router from 'koa-router';
import feedController from '../controllers/feedController';
import postController from '../controllers/postController';

var router = new Router();

router.get('/', postController.listAll);
router.get('/:id', postController.listOne);

export default router;
