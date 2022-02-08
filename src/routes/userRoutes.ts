import {Router} from 'express'
import  userController  from '@controllers/userController'
import followController from '@controllers/followController'
import ensureAuthenticated from '@middlewares/ensureAuthenticated'
import validate from '@middlewares/validateFields'
import paginate from '@middlewares/paginate'
import emailController from '@controllers/emailController'

const routes = Router()

routes.post('/', validate('create-user'), userController.create)
routes.delete('/', ensureAuthenticated, userController.delete)
routes.post('/:id/follow', ensureAuthenticated, followController.follow)
routes.delete('/:id/follow', ensureAuthenticated, followController.unfollow)
routes.get('/', paginate, userController.getMany)
routes.get('/:username', userController.get)
routes.get('/:id/scraps', paginate, userController.getScraps)
routes.get('/email-confirmation/:token', validate('confirm-email'), emailController.confirm)

export default routes