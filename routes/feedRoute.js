import Router from 'koa-router'
import feedController from '../controllers/feedController'

var router = new Router()

router.post('/', feedController.create)
router.get('/', feedController.listAll)
router.get('/:id', feedController.list)
router.delete('/:id', feedController.remove)

export default router