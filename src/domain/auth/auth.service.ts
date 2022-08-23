import { getRepository } from "typeorm"
import { RefreshTokens } from "../../models/RefreshTokens"
import { User } from "../../models/User"
import { HttpException } from "../../utils/httpException"
import bcrypt from 'bcrypt'
import { createToken } from "../../utils/createToken"

class AuthService {
  async login(data): Promise<{accessToken: string, refreshToken: string}> {
		const userRepo = getRepository(User)
		const refreshTokenRepo = getRepository(RefreshTokens)

		const user = await userRepo.findOne({
			where: [
				{username: data.user},
				{email: data.user}
			]
		})

		if(!user) throw new HttpException(401, 'Incorrect user and/or password')

		const passwordIsValid = await bcrypt.compare(data.password, user.password_hash)

		if(!passwordIsValid) throw new HttpException(401, 'Incorrect user and/or password')

		const accessToken = createToken(user.id)
		
		const refreshToken = await refreshTokenRepo.create({
			user: user
		})

		await refreshTokenRepo.save(refreshToken)

		return {accessToken, refreshToken: refreshToken.token}
	}

	async validateRefreshToken(rToken):  Promise<{accessToken: string, refreshToken: string}>{
		const rTokenRepo = getRepository(RefreshTokens)

		const validToken = await rTokenRepo.findOne(rToken)

		if(!validToken) throw new HttpException(401, 'Refresh Token Invalid')

		const userRepo = getRepository(User)

		const user = await userRepo.findOne(validToken.user)

		if(!user) throw new HttpException(400, 'User Invalid')

		const newToken = createToken(user.id)

		return {accessToken: newToken, refreshToken: validToken.token}
	}

	async logout(token): Promise<void>{
		const rTokenRepo = getRepository(RefreshTokens)

		await rTokenRepo.delete(token)
	}

	async changePassword(userId, oldPassword, newPassword): Promise<void>{
		const userRepo = getRepository(User)
		const rTokenRepo = getRepository(RefreshTokens)


		const user = await userRepo.findOne(userId)

		if(!user) throw new HttpException(400, 'User doesn\'t exists')

		const oldPasswordIsValid = await bcrypt.compare(oldPassword, user.password_hash)
		
		if(!oldPasswordIsValid) throw new HttpException(401, 'current password is invalid')

		const newPasswordHash = await bcrypt.hash(newPassword, 8)

		await userRepo.update(user.id, {
			password_hash: newPasswordHash
		})

		await rTokenRepo.delete({user: userId})
	}
}

export default new AuthService()