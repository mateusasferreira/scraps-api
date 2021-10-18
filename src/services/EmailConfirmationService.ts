import jwt from 'jsonwebtoken'
import { getCustomRepository, } from 'typeorm'
import { UserRepository } from '@repositories/UserRepository'

class EmailConfirmationService {
	async confirm(token){
		const userRepo = getCustomRepository(UserRepository)

		const id = jwt.verify(token, process.env.JWT_SECRET) as string

		await userRepo.update(id, { confirmed: true}) 
	}
}

export default new EmailConfirmationService()