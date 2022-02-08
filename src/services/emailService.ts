import { getRepository } from 'typeorm'
import { transport } from '@config/mailer.config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from '@models/User'
import ejs from 'ejs'

interface TokenPayload extends JwtPayload {
  id: string;
}

class EmailService {
	async sendConfirmationEmail(id, username, email): Promise<void> {
		const token = jwt.sign({ id }, process.env.JWT_SECRET, {
			expiresIn: 60 * 60,
		})

		const link = `${process.env.BASE_URL}/confirmation/${token}`

		ejs.renderFile(
			'src/views/emails/confirmEmail.ejs',
			{ username, link },
			function(err, str){
				if(err) {
					console.log(err)
					return
				}				
				
				transport.sendMail({
					to: email,
					subject: '[Scraper] Confirm your email',
					html: str
				})
					.then(res => console.log(res))
					.catch(e => console.log(e))
			}
		)
	}

	async confirmEmail(token): Promise<void> {
		const userRepo = getRepository(User)

		const { id } = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload

		await userRepo.update(id, { confirmed: true })
	}

	async sendRecoverPassword(email, username, newPassword) {
		
		const link = `${process.env.CLIENT_ORIGIN}/login`

		ejs.renderFile(
			'src/views/emails/recoverPassword.ejs',
			{ username, newPassword, link },
			function(err, str){
				if(err) {
					console.log(err)
					throw new Error(err.message)
				}				
				
				transport.sendMail({
					to: email,
					subject: '[Scraper] New Password',
					html: str,
				})
					.then(res => console.log(res))
					.catch(e => console.log(e))
			}
		)
	}
}

export default new EmailService()
