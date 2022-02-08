import {Router} from 'express'

import likeController from '@controllers/likeController'
import scrapController from '@controllers/scrapController'
import ensureAuthenticated from '@middlewares/ensureAuthenticated'
import validate from '@middlewares/validateFields'

const routes = Router()

routes.post('/:receiverId', validate('create-scrap'), ensureAuthenticated, scrapController.create)
routes.get('/:id', validate('get-scrap'), scrapController.getOne)
routes.patch('/:id', validate('update-scrap'), ensureAuthenticated, scrapController.update)
routes.delete('/:id', validate('delete-scrap'), ensureAuthenticated, scrapController.delete)
routes.post('/:id/like', ensureAuthenticated, likeController.like)
routes.delete('/:id/like', ensureAuthenticated, likeController.dislike)

export default routes