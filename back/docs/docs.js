import userRoutes from '../controllers/users.docs.js'
import localPostRoutes from '../controllers/localPosts.docs.js'

const apiDocs = {
    openapi: '3.0.0',
    info: {
        title: 'Бюджетный чувачок',
        description: 'апи к бюджетному чувачку, эмейл скорее всего не работает, т.к. почту уже закрыли за неиспользование.',
        version: '1.0.0'
    },
    servers: [
        {
            url: 'http://localhost:3000'
        }
    ],
    paths: {
        ...userRoutes,
        ...localPostRoutes
    }



};

export default apiDocs