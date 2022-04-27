import { Router } from 'express'
import asyncHandler from 'express-async-handler'

import likeController from '@controllers/likeController'
import scrapController from '@controllers/scrapController'
import ensureAuthenticated from '@middlewares/ensureAuthenticated'
import validate from '@middlewares/validateFields'

const routes = Router()

routes.post(
	'/:receiverId',
	validate('create-scrap'),
	ensureAuthenticated,
	asyncHandler(scrapController.create.bind(scrapController))
)

routes.get(
	'/:id',
	validate('get-scrap'),
	asyncHandler(scrapController.getOne.bind(scrapController))
)

routes.patch(
	'/:id',
	validate('update-scrap'),
	ensureAuthenticated,
	asyncHandler(scrapController.update.bind(scrapController))
)

routes.delete(
	'/:id',
	validate('delete-scrap'),
	ensureAuthenticated,
	asyncHandler(scrapController.delete.bind(scrapController))
)

routes.post(
	'/:id/like',
	ensureAuthenticated,
	asyncHandler(likeController.like.bind(likeController))
)

routes.delete(
	'/:id/like',
	ensureAuthenticated,
	asyncHandler(likeController.dislike.bind(likeController))
)

export default routes
