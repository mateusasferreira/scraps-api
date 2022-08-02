import { Router } from 'express'
import asyncHandler from 'express-async-handler'

import likeController from '@controllers/likeController'
import scrapController from '@controllers/scrapController'
import validate from '@middlewares/validateFields'
import authorizate from '../middlewares/ensureAutorizated'
import passport from 'passport'

const routes = Router()

routes.post(
	'/:receiverId',
	validate('create-scrap'),
	passport.authenticate('jwt', {session: false}),
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
	passport.authenticate('jwt', {session: false}),
	asyncHandler(scrapController.update.bind(scrapController))
)

routes.delete(
	'/:id',
	// validate('delete-scrap'),
	passport.authenticate('jwt', {session: false}),
	authorizate('scrap', 'delete'),
	asyncHandler(scrapController.delete.bind(scrapController))
)

routes.post(
	'/:id/like',
	passport.authenticate('jwt', {session: false}),
	asyncHandler(likeController.like.bind(likeController))
)

routes.delete(
	'/:id/like',
	passport.authenticate('jwt', {session: false}),
	asyncHandler(likeController.dislike.bind(likeController))
)

export default routes
