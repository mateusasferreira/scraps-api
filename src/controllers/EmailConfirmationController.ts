
import EmailConfirmationService from '@services/EmailConfirmationService'
import {Request, Response} from 'express'


class EmailConfirmationController {
	async confirm(req: Request, res: Response): Promise<void>{
		try {
			const {token} = req.params

			await EmailConfirmationService.confirm(token)
      
			res.sendStatus(200)
		} catch(e) {
			console.log(e)
			res.sendStatus(400)
		}
	}

}

export default new EmailConfirmationController()