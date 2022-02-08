import {Router} from 'express'
import multer from 'multer'

import profileController from '@controllers/profileController'
import validate from '@middlewares/validateFields'
import ensureAuthenticated from '@middlewares/ensureAuthenticated'

const routes = Router()

const upload = multer()

routes.post('/', upload.single('avatar'), validate('create-profile'), ensureAuthenticated, profileController.create)
routes.get('/me', ensureAuthenticated, profileController.getMyProfile)
routes.get('/image/:key', validate('get-image-stream'), profileController.getImageStream)
routes.put('/', upload.single('avatar'), validate('create-profile'), ensureAuthenticated, profileController.update)

export default routes