import router from '../router.js'

export default function (response) {
    // 401 response will redirect to login page
    if (response.status === 401) {
        if (!['/auth/login', '/auth/register', '/api/user'].includes(response.url)) {
            router.push({
                name: 'login'
            })
        }
    } else {
        // transform the data
        let data = response.body && response.body.data
        if (Array.isArray(data)) {
            for (let i = 0, len = data.length; i < len; i++) {
                if (void 0 !== data[i].feed_id && Array.isArray(data[i].feed_id)) {
                    if (typeof data[i].feed_id[0] === 'string') {
                        response.body.data[i].feed_id = data[i].feed_id[0]
                    } else {
                        response.body.data[i] = Object.assign(data[i].feed_id[0], data[i], {
                            feed_id: data[i].feed_id[0]._id,
                            feed_title: data[i].feed_id[0].title
                        })
                    }
                }
                if (void 0 !== data[i].user_id && Array.isArray(data[i].user_id)) {
                    response.body.data[i].user_id = data[i].user_id[0];
                }
            }
        } else if (typeof data === 'object') {
            if (void 0 !== data.feed_id && Array.isArray(data.feed_id)) {
                if (typeof data.feed_id[0] === 'string') {
                    response.body.data.feed_id = data.feed_id[0]
                } else {
                    response.body.data = Object.assign(data.feed_id[0], data, {
                        feed_id: data.feed_id[0]._id,
                        feed_title: data.feed_id[0].title
                    });
                }
            }
            if (void 0 !== data.user_id && Array.isArray(data.user_id)) {
                response.body.data.user_id = data.user_id[0]
            }
        }
        return response
    }
}