import { Router } from 'express'
import multer from 'multer'
import asyncHandler from 'express-async-handler'

import profileController from '@domain/profile/profile.controller'
import validate from '@domain/profile/profile.validators'
import authenticate from '@middlewares/authenticate'

const routes = Router()

const upload = multer()

routes.post(
	'/',
	upload.single('avatar'),
	validate('create-profile'),
	authenticate,
	asyncHandler(profileController.create.bind(profileController))
)

routes.get(
	'/me',
	authenticate,
	asyncHandler(profileController.getMyProfile.bind(profileController))
)

routes.get(
	'/image/:key',
	asyncHandler(profileController.getImageStream.bind(profileController))
)

routes.put(
	'/',
	upload.single('avatar'),
	validate('create-profile'),
	authenticate,
	asyncHandler(profileController.update.bind(profileController))
)

export default routes
