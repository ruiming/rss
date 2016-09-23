import Router from 'koa-router';
import feedController from '../controllers/feedController';

var router = new Router();

router.post('/', feedController.create);
router.get('/:id', feedController.list);
router.delete('/:id', feedController.remove);
router.get('/', feedController.listAll);

export default router;
