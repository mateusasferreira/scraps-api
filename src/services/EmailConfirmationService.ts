import { getCustomRepository, } from 'typeorm'
import { UserRepository } from '@repositories/UserRepository'
import {transport} from '@config/mailer.config'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface TokenPayload extends JwtPayload {
	id: string
}

class EmailConfirmationService {
	async sendEmail(id, email){
		const token = jwt.sign({id}, process.env.JWT_SECRET, {
			expiresIn: 60 * 60
		})    

		await transport.sendMail({
			to: email,
			subject: '[Scraper] Confirm your email',
			html: `
        <a href="${process.env.BASE_URL}/confirmation/${token}">confirm</a>
      `
		})
	}
  
	async confirm(token){
		const userRepo = getCustomRepository(UserRepository)

		const {id} = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload
		
		await userRepo.update(id, { confirmed: true}) 
	}
}

export default new EmailConfirmationService()