import EmailConfirmationController  from '@controllers/EmailConfirmationController'
import { Router } from 'express'

const emailConfirmation = Router()

emailConfirmation.get('/confirmation/:token', EmailConfirmationController.confirm)

export default emailConfirmation