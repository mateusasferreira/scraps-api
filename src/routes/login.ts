import  UserController  from '@controllers/UserController'
import { Router } from 'express'

const login = Router()

login.post('/login', UserController.login)

export default login