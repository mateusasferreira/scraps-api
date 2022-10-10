import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { UserController } from '@domain/user/user.controller'
import validate from '@domain/user/user.validators'
import paginate from '@middlewares/paginate'
import authenticate from '@middlewares/authenticate'
import Container from 'typedi'

const userController = Container.get(UserController)

const routes = Router()

routes.post(
	'/signup',
	validate('create-user'),
	asyncHandler(userController.create.bind(userController))
)

routes.delete(
	'/',
	authenticate,
	asyncHandler(userController.delete.bind(userController))
)

routes.post(
	'/:id/follow',
	authenticate,
	asyncHandler(userController.follow.bind(userController))
)

routes.post(
	'/:id/unfollow',
	authenticate,
	asyncHandler(userController.unfollow)
)

routes.get(
	'/',
	asyncHandler(userController.getMany.bind(userController))
)

routes.get('/:id', asyncHandler(userController.get.bind(userController)))

routes.get(
	'/:id/scraps',
	paginate,
	asyncHandler(userController.getScraps)
)

export default routes
