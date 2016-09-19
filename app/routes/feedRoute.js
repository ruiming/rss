import Router from 'koa-router';
import feedController from '../controllers/feedController';

var router = new Router();

router.post('/create', feedController.create);
router.get('/:id', feedController.list);
router.get('/:id/post', feedController.listPost);

export default router;
