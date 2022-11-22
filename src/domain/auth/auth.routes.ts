import { Router } from 'express'

import validate from './auth.validators'
import authenticate from '@middlewares/authenticate'
import Container from 'typedi'
import { AuthController } from './auth.controller'

const routes = Router()

const authController = Container.get(AuthController)

routes.post(
	'/login',
	validate('login'),
	authController.login.bind(authController)
)

routes.post(
	'/logout/',
	authenticate,
	authController.logout.bind(authController)
)

routes.post(
	'/refresh',
	validate('refresh-token'),
	authController.refreshToken.bind(authController)
)

routes.patch(
	'/change-password',
	validate('change-password'),
	authenticate,
	authController.changePassword.bind(authController)
)

export default routes
