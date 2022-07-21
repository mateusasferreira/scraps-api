import { Router } from 'express'

import authController from '@controllers/authController'
import validate from '@middlewares/validateFields'
import ensureAuthenticated from '@middlewares/ensureAuthenticated'
import asyncHandler from 'express-async-handler'

const routes = Router()

routes.post(
	'/login',
	validate('login'),
	asyncHandler(authController.login.bind(authController))
)

routes.post(
	'/logout/',
	ensureAuthenticated,
	asyncHandler(authController.logout.bind(authController))
)

routes.post(
	'/refresh',
	validate('refresh-token'),
	asyncHandler(authController.refreshToken.bind(authController))
)

routes.patch(
	'/change-password',
	validate('change-password'),
	ensureAuthenticated,
	asyncHandler(authController.changePassword.bind(authController))
)

export default routes
