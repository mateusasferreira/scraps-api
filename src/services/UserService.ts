import { getRepository, } from 'typeorm'
//import { UserRepository } from '@repositories/UserRepository'
import bcrypt from 'bcrypt'
import EmailConfirmationService from '@services/EmailService'
import { RefreshTokens } from '@models/RefreshTokens'
import { User } from '@models/User'
import { createToken } from '@utils/createToken'

class UserService {

	async create(data){
		const userRepo = getRepository(User)

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

		await EmailConfirmationService.sendConfirmationEmail(user.id, user.email)
		
		return user
	}

	async login(data) {
		const userRepo = getRepository(User)
		const refreshTokenRepo = getRepository(RefreshTokens)

		const user = await userRepo.findOne({
			where: {username: data.username}
		})

		if(!user) throw new Error('User doesn\'t exists')

		if(!user.confirmed) throw new Error('Email not Confirmed')

		const passwordIsValid = await bcrypt.compare(data.password, user.password_hash)

		if(!passwordIsValid) throw new Error('Incorrect password')

		const accessToken = createToken(user)
		
		const refreshToken = await refreshTokenRepo.create({
			user: user
		})

		await refreshTokenRepo.save(refreshToken)

		return {accessToken, refreshToken: refreshToken.token}
	}

	async validateRefreshToken(rToken){
		const rTokenRepo = getRepository(RefreshTokens)

		const validToken = await rTokenRepo.findOne(rToken)

		if(!validToken) throw new Error('Refresh Token Invalid')

		const userRepo = getRepository(User)

		const user = await userRepo.findOne(validToken.user)

		if(!user) throw new Error('User Invalid')

		const newToken = createToken(user)

		return {accessToken: newToken, refreshToken: validToken.token}
	}

	async logout(token){
		const rTokenRepo = getRepository(RefreshTokens)

		await rTokenRepo.delete(token)
	}
}

export default new UserService()