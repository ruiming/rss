import Router from 'koa-router'
import userController from '../controllers/userController'

var router = new Router()

router.get('/', userController.list)
router.put('/', userController.update)

export default router
