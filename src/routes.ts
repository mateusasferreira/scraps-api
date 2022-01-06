import {Router} from 'express'
import multer from 'multer'

import  UserController  from '@controllers/UserController'
import EmailConfirmationController from '@controllers/EmailConfirmationController'
import ProfileController from '@controllers/ProfileController'

import ensureAuthenticated from '@middlewares/ensureAuthenticated'
import validate from '@middlewares/validateFields'
import ScrapController from '@controllers/ScrapController'

const routes = Router()

const upload = multer()


routes.get('/', ensureAuthenticated, (req, res) => {
	console.log(req.body.user)
	res.status(200).json({message: 'Hello World', user: req.body.user})
})

// user routes
routes.post('/users', validate('create-user'), UserController.create)
routes.post('/login', validate('login'), UserController.login)
routes.delete('/logout', validate('logout'), ensureAuthenticated, UserController.logout)
routes.patch('/recover-password', validate('recover-password'), UserController.recoverPassword)
routes.post('/change-password', validate('change-password'), ensureAuthenticated, UserController.changePassword)
routes.delete('/users', ensureAuthenticated, UserController.delete)
routes.get('/confirmation/:token', validate('confirm-email'), EmailConfirmationController.confirm)
routes.post('/token', validate('refresh-token'), UserController.refreshToken)

//profile routes
routes.post('/profile', upload.single('avatar'), validate('create-profile'), ensureAuthenticated, ProfileController.create)
routes.get('/profile/:id', validate('retrieve-profile'), ProfileController.get)
routes.get('/images/:key', validate('get-image-stream'), ProfileController.getImageStream)
routes.put('/profile', upload.single('avatar'), validate('create-profile'), ensureAuthenticated, ProfileController.update)

//scraps routes
routes.post('/scraps/:receiverId', validate('create-scrap'), ensureAuthenticated, ScrapController.create)
routes.get('/scraps/:id', validate('get-scrap'), ScrapController.get)
routes.patch('/scraps/:id', validate('update-scrap'), ensureAuthenticated, ScrapController.update)
routes.delete('/scraps/:id', validate('delete-scrap'), ensureAuthenticated, ScrapController.delete)

export default routes