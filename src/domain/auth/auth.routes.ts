import { Router } from 'express'

import authController from './auth.controller'
import validate from './auth.validators'
import asyncHandler from 'express-async-handler'
import authenticate from '@middlewares/authenticate'

const routes = Router()

routes.post(
	'/login',
	validate('login'),
	asyncHandler(authController.login.bind(authController))
)

routes.post(
	'/logout/',
	authenticate,
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
	authenticate,
	asyncHandler(authController.changePassword.bind(authController))
)

export default routes
