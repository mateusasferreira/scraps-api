import { getRepository, } from 'typeorm'
import bcrypt from 'bcrypt'
import EmailService from '@services/emailService'
import { RefreshTokens } from '@models/RefreshTokens'
import { User } from '@models/User'
import { createToken } from '@utils/createToken'
import emailService from '@services/emailService'
import randomString from 'randomstring'


class UserService {
	async getOne(username): Promise<User>{
		const userRepo = getRepository(User)

		const profile = await userRepo
			.createQueryBuilder('user')
			.select(['user.id', 'user.username'])
			.leftJoinAndSelect('user.profile', 'profile')
			.where('user.username = :username', {username})
			.loadRelationCountAndMap('user.scraps_received', 'user.scraps_received' )
			.loadRelationCountAndMap('user.scraps_sent', 'user.scraps_sent')
			.loadRelationCountAndMap('user.followers', 'user.followedBy')
			.loadRelationCountAndMap('user.follows', 'user.following')
			.getOne()

		return profile
	}

	async getMany(options): Promise<[User[], number]>{
		const userRepo = getRepository(User)

		const profile = await userRepo
			.createQueryBuilder('user')
			.select(['user.id', 'user.username', 'user.created_at'])
			.leftJoinAndSelect('user.profile', 'profile')
			.loadRelationCountAndMap('user.scraps_received', 'user.scraps_received' )
			.loadRelationCountAndMap('user.scraps_sent', 'user.scraps_sent')
			.loadRelationCountAndMap('user.followers', 'user.followedBy')
			.loadRelationCountAndMap('user.follows', 'user.following')
			.orderBy('user.created_at', 'DESC')
			.take(options.limit)
			.skip(options.skip)
			.getMany()

		const count = await userRepo.count()

		return [profile, count]
	}

	async create(data): Promise<User>{
		const userRepo = getRepository(User)

		const passwordHash = await bcrypt.hash(data.password, 8)

		data.password = undefined
			
		const user = await userRepo.create({
			username: data.username, 
			email: data.email,
			password_hash: passwordHash
		})
    
		await userRepo.save(user)

		await EmailService.sendConfirmationEmail(user.id, user.email)
		
		return user
	}

	async login(data): Promise<{accessToken: string, refreshToken: string}> {
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

	async validateRefreshToken(rToken):  Promise<{accessToken: string, refreshToken: string}>{
		const rTokenRepo = getRepository(RefreshTokens)

		const validToken = await rTokenRepo.findOne(rToken)

		if(!validToken) throw new Error('Refresh Token Invalid')

		const userRepo = getRepository(User)

		const user = await userRepo.findOne(validToken.user)

		if(!user) throw new Error('User Invalid')

		const newToken = createToken(user)

		return {accessToken: newToken, refreshToken: validToken.token}
	}

	async logout(token): Promise<void>{
		const rTokenRepo = getRepository(RefreshTokens)

		await rTokenRepo.delete(token)
	}

	async recoverPassword(email: string): Promise<void>{
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

		emailService.sendRecoverPassword(email, newPassword)
	}

	async changePassword(userId, oldPassword, newPassword): Promise<void>{
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
	}

	async delete(id): Promise<void>{
		const userRepo = getRepository(User)

		await userRepo.delete(id)
	}
}

export default new UserService()