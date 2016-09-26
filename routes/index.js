import Router from 'koa-router';
import send from 'koa-send';
import feedRoute from './feedRoute';
import postRoute from './postRoute';

var api = new Router({
    prefix: '/api'
});

api.use('/feed', feedRoute.routes(), feedRoute.allowedMethods());
api.use('/feed/:feed_id/post', postRoute.routes(), postRoute.allowedMethods());

export default api;
