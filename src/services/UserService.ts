import { getCustomRepository, } from 'typeorm'
import { UserRepository } from '@repositories/UserRepository'
import bcrypt from 'bcrypt'
import EmailConfirmationService from './EmailConfirmationService'
import jwt from 'jsonwebtoken'

class UserService {

	async create(data){
		const userRepo = getCustomRepository(UserRepository)

		const userAlreadyExists = await userRepo.findOne({
			where: {username: data.username}
			
		})

		if(userAlreadyExists) throw new Error('username already registered')

		const emailAlreadyRegistered = await userRepo.findOne({
			where: {email: data.email}
		})

		if(emailAlreadyRegistered) throw new Error('email already exists')

		const passwordHash = await bcrypt.hash(data.password, 8)

		data.password = undefined
			
		const user = await userRepo.create({
			username: data.username, 
			email: data.email,
			password_hash: passwordHash
		})
    
		await userRepo.save(user)

		await EmailConfirmationService.sendEmail(user.id, user.email)
	}

	async login(data) {
		const userRepo = getCustomRepository(UserRepository)

		const user = await userRepo.findOne({
			where: {username: data.username}
		})

		if(!user) throw new Error('User doesn\'t exists')

		const passwordIsValid = await bcrypt.compare(data.password, user.password_hash)

		if(!passwordIsValid) throw new Error('Incorrect password')

		const token = jwt.sign({user}, process.env.JWT_SECRET)

		return token
		

	}
}

export default new UserService()