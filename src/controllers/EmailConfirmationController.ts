
import EmailService from '@services/EmailService'
import {Request, Response} from 'express'


class EmailConfirmationController {
	async confirm(req: Request, res: Response): Promise<void>{
		try {
			const {token} = req.params

			await EmailService.confirmEmail(token)
      
			res.redirect('/')
		} catch(e) {
			console.log(e)
			res.sendStatus(400)		
		}
	}

}

export default new EmailConfirmationController()