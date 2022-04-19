import {Router} from 'express'
import  userController  from '@controllers/userController'
import followController from '@controllers/followController'
import ensureAuthenticated from '@middlewares/ensureAuthenticated'
import validate from '@middlewares/validateFields'
import paginate from '@middlewares/paginate'

const routes = Router()

routes.post('/', validate('create-user'), userController.create)
routes.delete('/', ensureAuthenticated, userController.delete)
routes.post('/:id/follow', ensureAuthenticated, followController.follow)
routes.delete('/:id/follow', ensureAuthenticated, followController.unfollow)
routes.get('/', paginate, userController.getMany)
routes.get('/:username', userController.get)
routes.get('/:id/scraps', paginate, userController.getScraps)
routes.post('/change-password', validate('change-password'), ensureAuthenticated, userController.changePassword)

export default routes