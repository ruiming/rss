import Router from 'koa-router';
import userController from '../controllers/userController';

var router = new Router();

router.get('/', userController.list);

export default router;
