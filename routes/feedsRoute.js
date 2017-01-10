import Router from 'koa-router'
import feedsController from '../controllers/feedsController'

const router = new Router()

router.get('/', feedsController.list)

export default router
