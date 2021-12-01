import {Router} from 'express'
import  UserController  from '@controllers/UserController'
import EmailConfirmationController from '@controllers/EmailConfirmationController'

import ensureAuthenticated from '@middlewares/ensureAuthenticated'

const routes = Router()

routes.get('/', ensureAuthenticated, (req, res) => {
	console.log(req.body.user)
	res.status(200).json({message: 'Hello World', user: req.body.user})
})

// user routes
routes.post('/users', UserController.create)
routes.post('/login', UserController.login)
routes.delete('/logout', ensureAuthenticated, UserController.logout)
routes.patch('/recover-password', ensureAuthenticated, UserController.recoverPassword)
routes.post('/change-password/:userId', ensureAuthenticated, UserController.changePassword)
routes.delete('/users/:id', ensureAuthenticated, UserController.delete)

//email confirmation route
routes.get('/confirmation/:token', EmailConfirmationController.confirm)

//token revalidation
routes.post('/token', UserController.refreshToken)


export default routes