import Router from 'koa-router'
import feedsController from '../controllers/feedsController'

let router = new Router()

router.get('/', feedsController.list)

export default router
