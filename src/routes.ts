import {Router} from 'express'
import  UserController  from '@controllers/UserController'
import EmailConfirmationController from '@controllers/EmailConfirmationController'

const routes = Router()

routes.get('/', (req, res) => {
	res.status(200).json({message: 'Hello World'})
})

// user route
routes.post('/users', UserController.create)

// login route
routes.post('/login', UserController.login)

//email confirmation route
routes.get('/confirmation/:token', EmailConfirmationController.confirm)

routes.post('/token', UserController.refreshToken)

export default routes