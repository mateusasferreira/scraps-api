import {Router} from 'express'
import  UserController  from '@controllers/UserController'
import EmailConfirmationController from '@controllers/EmailConfirmationController'

import ensureAuthenticated from '@middlewares/ensureAuthenticated'

const routes = Router()

routes.get('/', ensureAuthenticated, (req, res) => {
	console.log(req.body.user)
	res.status(200).json({message: 'Hello World', user: req.body.user})
})

// user route
routes.post('/users', UserController.create)
routes.post('/login', UserController.login)
routes.delete('/logout', UserController.logout)
routes.patch('/recover-password', UserController.recoverPassword)
routes.post('/change-password/:userId', UserController.changePassword)

//email confirmation route
routes.get('/confirmation/:token', EmailConfirmationController.confirm)

//token revalidation
routes.post('/token', UserController.refreshToken)


export default routes