import { Router } from 'express'

import userController from '@controllers/userController'
import validate from '@middlewares/validateFields'
import ensureAuthenticated from '@middlewares/ensureAuthenticated'
import asyncHandler from 'express-async-handler'

const routes = Router()

routes.post(
	'/login',
	validate('login'),
	asyncHandler(userController.login.bind(userController))
)

routes.delete(
	'/logout/:refreshToken',
	ensureAuthenticated,
	asyncHandler(userController.logout.bind(userController))
)

routes.post(
	'/refresh',
	validate('refresh-token'),
	asyncHandler(userController.refreshToken.bind(userController))
)

export default routes
