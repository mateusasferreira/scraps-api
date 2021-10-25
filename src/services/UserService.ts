import { getCustomRepository, getRepository, } from 'typeorm'
import { UserRepository } from '@repositories/UserRepository'
import bcrypt from 'bcrypt'
import EmailConfirmationService from './EmailConfirmationService'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { RefreshTokens } from '@models/RefreshTokens'
import { createToken } from '@utils/createToken'

interface TokenPayload extends JwtPayload {
	id: string
}

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
		const refreshTokenRepo = getRepository(RefreshTokens)

		const user = await userRepo.findOne({
			where: {username: data.username}
		})

		if(!user) throw new Error('User doesn\'t exists')

		if(!user.confirmed) throw new Error('Email not Confirmed')

		const passwordIsValid = await bcrypt.compare(data.password, user.password_hash)

		if(!passwordIsValid) throw new Error('Incorrect password')

		const token = createToken(user)
		
		const refreshToken = jwt.sign({id: user.id}, process.env.JWT_REFRESH_SECRET)

		const dbtoken = await refreshTokenRepo.create({
			token: refreshToken,
			user: user
		})

		await refreshTokenRepo.save(dbtoken)

		return {token, refreshToken}
	}

	async refreshToken(rToken){
		const payload = jwt.verify(rToken, process.env.JWT_REFRESH_SECRET) as TokenPayload
		
		const rTokenRepo = getRepository(RefreshTokens)

		const validToken = await rTokenRepo.findOne(rToken)

		if(!validToken) throw new Error('Refresh Token Invalid')

		const userRepo = getCustomRepository(UserRepository)

		const user = await userRepo.findOne(payload.id)

		if(!user) throw new Error('User Invalid')

		const newToken = createToken(user)

		return newToken
	}
}

export default new UserService()