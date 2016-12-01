import Router from 'koa-router'
import feedController from '../controllers/feedController'

var router = new Router()

router.post('/', feedController.create)
router.get('/', feedController.listAll)

router.put('/:id', feedController.subscribe)
router.get('/:id', feedController.list)
router.delete('/:id', feedController.unsubscribe)

export default router
