import Router from 'koa-router';
import send from 'koa-send';
import feedRoute from './feedRoute';
import feedsRoute from './feedsRoute';
import postRoute from './postRoute';
import userRoute from './userRoute';
import postsRoute from './postsRoute';

var api = new Router({
    prefix: '/api'
});

api.use('/feeds', feedsRoute.routes(), feedsRoute.allowedMethods());
api.use('/feed', feedRoute.routes(), feedRoute.allowedMethods());
api.use('/post', postRoute.routes(), postRoute.allowedMethods());
api.use('/posts', postsRoute.routes(), postsRoute.allowedMethods());
api.use('/user', userRoute.routes(), userRoute.allowedMethods());

export default api;
