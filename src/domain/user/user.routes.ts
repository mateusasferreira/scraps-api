import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import userController from '@domain/user/user.controller'
import validate from '@domain/user/user.validators'
import paginate from '@middlewares/paginate'
import authenticate from '@middlewares/authenticate'

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
	asyncHandler(userController.unfollow.bind(userController))
)

routes.get(
	'/',
	paginate,
	asyncHandler(userController.getMany.bind(userController))
)

routes.get('/:username', asyncHandler(userController.get.bind(userController)))

routes.get(
	'/:id/scraps',
	paginate,
	asyncHandler(userController.getScraps.bind(userController))
)

export default routes
