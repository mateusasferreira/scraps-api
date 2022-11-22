import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { UserController } from '@domain/user/user.controller'
import validate from '@domain/user/user.validators'
import authenticate from '@middlewares/authenticate'
import Container from 'typedi'

const userController = Container.get(UserController)

const routes = Router()

routes.post(
	'/signup',
	validate('create-user'),
	userController.create.bind(userController)
)

routes.delete(
	'/',
	authenticate,
	userController.delete.bind(userController)
)

routes.post(
	'/:id/follow',
	authenticate,
	userController.follow.bind(userController)
)

routes.post(
	'/:id/unfollow',
	authenticate,
	userController.unfollow.bind(userController)
)

routes.get(
	'/',
	userController.getMany.bind(userController)
)

routes.get('/:id', userController.get.bind(userController))

routes.get(
	'/:id/scraps',
	userController.getScraps.bind(userController)
)

export default routes
