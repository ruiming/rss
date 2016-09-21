import Router from 'koa-router';
import userController from '../controllers/userController';

var router = new Router();

router.post('/login', userController.get);
router.post('/register', userController.create);

export default router;
