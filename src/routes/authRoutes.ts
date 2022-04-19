import {Router} from 'express'

import  userController  from '@controllers/userController'
import validate from '@middlewares/validateFields'
import ensureAuthenticated from '@middlewares/ensureAuthenticated'

const routes = Router()

routes.post('/login', validate('login'), userController.login)
routes.delete('/logout', validate('logout'), ensureAuthenticated, userController.logout)
routes.post('/refresh', validate('refresh-token'), userController.refreshToken)

export default routes