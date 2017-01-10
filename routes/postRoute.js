import Router from 'koa-router'
import postController from '../controllers/postController'

const router = new Router()

router.get('/:id', postController.listOne)
router.put('/:id', postController.update)

export default router
