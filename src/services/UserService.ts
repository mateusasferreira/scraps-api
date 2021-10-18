import { getCustomRepository, } from 'typeorm'
import { UserRepository } from '@repositories/UserRepository'
import bcrypt from 'bcrypt'

class UserService {
	async create(data){
		const userRepo = getCustomRepository(UserRepository)

		const passwordHash = await bcrypt.hash(data.password, 8)

		data.password = undefined
			
		const user = await userRepo.create({
			username: data.username, 
			email: data.email,
			password_hash: passwordHash
		})

		await userRepo.save(user)
    
	}
}

export default new UserService()