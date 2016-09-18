import Router from 'koa-router';
import feedController from '../controllers/feedController';

var router = new Router();

router.get('/create', feedController.create);
router.get('/:rid', feedController.get);

export default router;
