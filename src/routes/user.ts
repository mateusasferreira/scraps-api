import  UserController  from '@controllers/UserController'
import { Router } from 'express'

const user = Router()

user.post('/users', UserController.create)

export default user