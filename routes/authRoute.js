import Router from 'koa-router'
import authController from '../controllers/authController'

const router = new Router()

router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/logout', authController.logout)

export default router
