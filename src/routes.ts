import {Router} from 'express'
import multer from 'multer'

import  UserController  from '@controllers/UserController'
import EmailConfirmationController from '@controllers/EmailConfirmationController'
import ProfileController from '@controllers/ProfileController'

import ensureAuthenticated from '@middlewares/ensureAuthenticated'
import validate from '@middlewares/validateFields'

const routes = Router()

const upload = multer({ dest: 'uploads/' })


routes.get('/', ensureAuthenticated, (req, res) => {
	console.log(req.body.user)
	res.status(200).json({message: 'Hello World', user: req.body.user})
})

// user routes
routes.post('/users', validate('create-user'), UserController.create)
routes.post('/login', validate('login'), UserController.login)
routes.delete('/logout', ensureAuthenticated, UserController.logout)
routes.patch('/recover-password', ensureAuthenticated, UserController.recoverPassword)
routes.post('/change-password', ensureAuthenticated, UserController.changePassword)
routes.delete('/users', ensureAuthenticated, UserController.delete)

//email confirmation route
routes.get('/confirmation/:token', EmailConfirmationController.confirm)

//token revalidation
routes.post('/token', UserController.refreshToken)


routes.post('/profile', upload.single('avatar'), ensureAuthenticated, ProfileController.create)


export default routes