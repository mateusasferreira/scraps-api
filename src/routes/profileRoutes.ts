import { Router } from 'express'
import multer from 'multer'
import asyncHandler from 'express-async-handler'

import profileController from '@controllers/profileController'
import validate from '@middlewares/validateFields'
import ensureAuthenticated from '@middlewares/ensureAuthenticated'

const routes = Router()

const upload = multer()

routes.post(
	'/',
	upload.single('avatar'),
	validate('create-profile'),
	ensureAuthenticated,
	asyncHandler(profileController.create.bind(profileController))
)

routes.get(
	'/me',
	ensureAuthenticated,
	asyncHandler(profileController.getMyProfile.bind(profileController))
)

routes.get(
	'/image/:key',
	validate('get-image-stream'),
	asyncHandler(profileController.getImageStream.bind(profileController))
)

routes.put(
	'/',
	upload.single('avatar'),
	validate('create-profile'),
	ensureAuthenticated,
	asyncHandler(profileController.update.bind(profileController))
)

export default routes
