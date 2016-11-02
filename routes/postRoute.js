import Router from 'koa-router'
import postController from '../controllers/postController'

var router = new Router()

router.get('/:id', postController.listOne)
router.put('/:id', postController.update)

export default router
