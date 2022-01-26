import { getRepository, SelectQueryBuilder, } from 'typeorm'
import bcrypt from 'bcrypt'
import EmailConfirmationService from '@services/EmailService'
import { RefreshTokens } from '@models/RefreshTokens'
import { User } from '@models/User'
import { createToken } from '@utils/createToken'
import EmailService from '@services/EmailService'
import randomString from 'randomstring'


class UserService {
	async get(username): Promise<User>{
		const userRepo = getRepository(User)

		const profile = await userRepo
			.createQueryBuilder('user')
			.select(['user.id', 'user.username'])
			.leftJoinAndSelect('user.profile', 'profile')
			.where('user.username = :username', {username})
			.leftJoinAndSelect('user.scraps_received', 'scraps')
			.getOne()

		return profile

	}

	async create(data): Promise<Partial<User>>{
		const userRepo = getRepository(User)

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

	async validateRefreshToken(rToken: string){
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

	async recoverPassword(email: string){
		const userRepo = getRepository(User)

		const user = await userRepo.findOne({
			where: {
				email: email
			}
		})

		if(!user) throw new Error('invalid email')

		if(!user.confirmed) throw new Error('Email not confirmed')

		const newPassword = randomString.generate(16)

		const newPasswordHash = await bcrypt.hash(newPassword, 8)

		await userRepo.update(user.id, {
			password_hash: newPasswordHash
		})

		EmailService.sendRecoverPassword(email, newPassword)
	}

	async changePassword(userId, oldPassword, newPassword){
		const userRepo = getRepository(User)
		const rTokenRepo = getRepository(RefreshTokens)


		const user = await userRepo.findOne(userId)

		if(!user) throw new Error('User doesn\'t exists')

		if(!user.confirmed) throw new Error('Email not Confirmed')

		const oldPasswordIsValid = await bcrypt.compare(oldPassword, user.password_hash)
		
		if(!oldPasswordIsValid) throw new Error('current password is invalid')

		const newPasswordHash = await bcrypt.hash(newPassword, 8)

		await userRepo.update(user.id, {
			password_hash: newPasswordHash
		})

		await rTokenRepo.delete({user: userId})
		
		return 
	}

	async delete(id){
		const userRepo = getRepository(User)

		await userRepo.delete(id)
	}
}

export default new UserService()