import { getRepository } from 'typeorm'
import {transport} from '@config/mailer.config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import {User} from '@models/User'

interface TokenPayload extends JwtPayload {
	id: string
}

class EmailConfirmationService {
	async sendConfirmationEmail(id, email){
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
  
	async confirmEmail(token){
		const userRepo = getRepository(User)

		const {id} = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload
		
		await userRepo.update(id, { confirmed: true}) 
	}

	async sendRecoverPassword(email, newPassword){
		await transport.sendMail({
			to: email,
			subject: '[Scraper] new password',
			html: `<span> Nova Senha: ${newPassword}</span>`,
		})
	}
}

export default new EmailConfirmationService()

