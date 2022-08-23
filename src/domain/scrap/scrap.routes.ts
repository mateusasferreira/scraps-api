import { Router } from 'express'
import asyncHandler from 'express-async-handler'

import scrapController from '@domain/scrap/scrap.controller'
import validate from '@domain/scrap/scrap.validators'
import grantAccess from '@middlewares/grantAccess'
import authenticate from '@middlewares/authenticate'

const routes = Router()

routes.post(
	'/:receiverId',
	validate('create-scrap'),
	authenticate,
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
	authenticate,
	asyncHandler(scrapController.update.bind(scrapController))
)

routes.delete(
	'/:id',
	// validate('delete-scrap'),
	authenticate,
	grantAccess('scrap', 'delete'),
	asyncHandler(scrapController.delete.bind(scrapController))
)

routes.post(
	'/:id/like',
	authenticate,
	asyncHandler(scrapController.like.bind(scrapController))
)

routes.delete(
	'/:id/like',
	authenticate,
	asyncHandler(scrapController.dislike.bind(scrapController))
)

export default routes
