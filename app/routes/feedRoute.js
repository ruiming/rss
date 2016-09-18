import Router from 'koa-router';
import feedController from '../controllers/feedController';

var router = new Router();

router.post('/create', feedController.create);
router.get('/:rid', feedController.get);

export default router;
