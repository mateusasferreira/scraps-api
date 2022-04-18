import {Router} from 'express'

import  userController  from '@controllers/userController'
import validate from '@middlewares/validateFields'
import ensureAuthenticated from '@middlewares/ensureAuthenticated'

const routes = Router()

routes.post('/login', validate('login'), userController.login)
routes.delete('/logout', validate('logout'), ensureAuthenticated, userController.logout)
routes.post('/change-password', validate('change-password'), ensureAuthenticated, userController.changePassword)
routes.post('/token', validate('refresh-token'), userController.refreshToken)

export default routes