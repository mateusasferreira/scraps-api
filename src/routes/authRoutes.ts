import { Router } from 'express'

import authController from '@controllers/authController'
import validate from '@middlewares/validateFields'
import asyncHandler from 'express-async-handler'
import passport from 'passport'

const routes = Router()

routes.post(
	'/login',
	validate('login'),
	asyncHandler(authController.login.bind(authController))
)

routes.post(
	'/logout/',
	passport.authenticate('jwt', {session: false}),
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
	passport.authenticate('jwt', {session: false}),
	asyncHandler(authController.changePassword.bind(authController))
)

export default routes
