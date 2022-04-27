import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import userController from '@controllers/userController'
import followController from '@controllers/followController'
import ensureAuthenticated from '@middlewares/ensureAuthenticated'
import validate from '@middlewares/validateFields'
import paginate from '@middlewares/paginate'

const routes = Router()

routes.post(
	'/',
	validate('create-user'),
	asyncHandler(userController.create.bind(userController))
)

routes.delete(
	'/',
	ensureAuthenticated,
	asyncHandler(userController.delete.bind(userController))
)

routes.post(
	'/:id/follow',
	ensureAuthenticated,
	asyncHandler(followController.follow.bind(followController))
)

routes.delete(
	'/:id/follow',
	ensureAuthenticated,
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

routes.patch(
	'/change-password',
	validate('change-password'),
	ensureAuthenticated,
	asyncHandler(userController.changePassword.bind(userController))
)

export default routes
