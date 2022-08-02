import { Router } from 'express'
import multer from 'multer'
import asyncHandler from 'express-async-handler'

import profileController from '@controllers/profileController'
import validate from '@middlewares/validateFields'
import passport from 'passport'

const routes = Router()

const upload = multer()

routes.post(
	'/',
	upload.single('avatar'),
	validate('create-profile'),
	passport.authenticate('jwt', {session: false}),
	asyncHandler(profileController.create.bind(profileController))
)

routes.get(
	'/me',
	passport.authenticate('jwt', {session: false}),
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
	passport.authenticate('jwt', {session: false}),
	asyncHandler(profileController.update.bind(profileController))
)

export default routes
