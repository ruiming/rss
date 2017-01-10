import Router from 'koa-router'
import postsController from '../controllers/postsController'

const router = new Router()

router.get('/', postsController.list)
router.put('/', postsController.update)
router.get('/recent', postsController.main)

export default router
