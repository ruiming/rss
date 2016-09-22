import Router from 'koa-router';
import feedController from '../controllers/feedController';

var router = new Router();

router.post('/', feedController.create);
router.get('/:id', feedController.list);
router.get('/', feedController.listAll);

export default router;
