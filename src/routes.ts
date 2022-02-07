import {Router} from 'express'
import multer from 'multer'

import  userController  from '@controllers/userController'
import emailController from '@controllers/emailController'
import profileController from '@controllers/profileController'
import scrapController from '@controllers/scrapController'
import likeController from '@controllers/likeController'
import followController from '@controllers/followController'

import ensureAuthenticated from '@middlewares/ensureAuthenticated'
import validate from '@middlewares/validateFields'
import paginate from '@middlewares/paginate'

const routes = Router()

const upload = multer()

routes.get('/', ensureAuthenticated, (req, res) => {
	console.log(req.body.user)
	res.status(200).json({message: 'Hello World', user: req.body.user})
})

// user routes
routes.post('/users', validate('create-user'), userController.create)
routes.delete('/users', ensureAuthenticated, userController.delete)
routes.post('/users/:id/follow', ensureAuthenticated, followController.follow)
routes.delete('/users/:id/follow', ensureAuthenticated, followController.unfollow)
routes.get('/users', paginate, userController.getMany)
routes.get('/users/:username', userController.get)
routes.get('/users/:id/scraps', paginate, userController.getScraps)

routes.post('/login', validate('login'), userController.login)
routes.delete('/logout', validate('logout'), ensureAuthenticated, userController.logout)
routes.patch('/recover-password', validate('recover-password'), userController.recoverPassword)
routes.post('/change-password', validate('change-password'), ensureAuthenticated, userController.changePassword)
routes.get('/confirmation/:token', validate('confirm-email'), emailController.confirm)
routes.post('/token', validate('refresh-token'), userController.refreshToken)

//profile routes
routes.post('/profile', upload.single('avatar'), validate('create-profile'), ensureAuthenticated, profileController.create)
routes.get('/my-profile', ensureAuthenticated, profileController.getMyProfile)
routes.get('/images/:key', validate('get-image-stream'), profileController.getImageStream)
routes.put('/profile', upload.single('avatar'), validate('create-profile'), ensureAuthenticated, profileController.update)

//scraps routes
routes.post('/scraps/:receiverId', validate('create-scrap'), ensureAuthenticated, scrapController.create)
routes.get('/scraps/:id', validate('get-scrap'), scrapController.getOne)
routes.patch('/scraps/:id', validate('update-scrap'), ensureAuthenticated, scrapController.update)
routes.delete('/scraps/:id', validate('delete-scrap'), ensureAuthenticated, scrapController.delete)
routes.post('/scraps/:id/like', ensureAuthenticated, likeController.like)
routes.delete('/scraps/:id/like', ensureAuthenticated, likeController.dislike)



export default routes