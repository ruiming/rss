import Router from 'koa-router';
import authController from '../controllers/authController';

var router = new Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

export default router;