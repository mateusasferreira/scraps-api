
import emailService from '@services/emailService'
import {Request, Response} from 'express'


class EmailController {
	async confirm(req: Request, res: Response): Promise<void>{
		try {
			const {token} = req.params

			await emailService.confirmEmail(token)
      
			res.redirect('/')
		} catch(e) {
			console.log(e)
			res.sendStatus(400)		
		}
	}

}

export default new EmailController()