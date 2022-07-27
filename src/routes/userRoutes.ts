import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import userController from '@controllers/userController'
import followController from '@controllers/followController'
import validate from '@middlewares/validateFields'
import paginate from '@middlewares/paginate'
import passport from 'passport'

const routes = Router()

routes.post(
	'/signup',
	validate('create-user'),
	asyncHandler(userController.create.bind(userController))
)

routes.delete(
	'/',
	passport.authenticate('jwt', {session: false}),
	asyncHandler(userController.delete.bind(userController))
)

routes.post(
	'/:id/follow',
	passport.authenticate('jwt', {session: false}),
	asyncHandler(followController.follow.bind(followController))
)

routes.post(
	'/:id/unfollow',
	passport.authenticate('jwt', {session: false}),
	asyncHandler(followController.unfollow.bind(followController))
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
