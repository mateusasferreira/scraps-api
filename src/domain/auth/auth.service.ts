import { DataSource } from "typeorm"
import { RefreshToken } from "../../models/RefreshToken"
import { User } from "../../models/User"
import { HttpException } from "../../utils/httpException"
import bcrypt from 'bcrypt'
import createToken from "../../utils/createToken"
import { Service } from "typedi"
import { AuthSuccessResponse, LoginPayload } from "./auth.interfaces"
import { getLoginPayloadFixture } from "./spec/fixtures"

@Service()
export class AuthService {
	
	constructor( private dataSource: DataSource ) {}

  async login(payload: LoginPayload): Promise<AuthSuccessResponse> {
		const userRepo = this.dataSource.getRepository(User)
		const refreshTokenRepo = this.dataSource.getRepository(RefreshToken)

		const user = await userRepo.createQueryBuilder()
			.where('user.email = :email', {email: payload.user})
			.orWhere('user.username = :username', {username: payload.user})
			.getOne()

		if(!user) throw new HttpException(401, 'Incorrect user and/or password')

		const passwordIsValid = await bcrypt.compare(payload.password, user.password_hash)

		if(!passwordIsValid) throw new HttpException(401, 'Incorrect user and/or password')

		const accessToken = createToken(user.id)
		
		const refreshToken = await refreshTokenRepo.create({
			user: user
		})

		await refreshTokenRepo.save(refreshToken)

		return {accessToken, refreshToken: refreshToken.token}
	}

	async validateRefreshToken(rToken):  Promise<AuthSuccessResponse>{
		const rTokenRepo = this.dataSource.getRepository(RefreshToken)

		const validToken = await rTokenRepo.findOne(rToken)

		if(!validToken) throw new HttpException(401, 'Refresh Token Invalid')

		const userRepo = this.dataSource.getRepository(User)

		const user = await userRepo.findOne({where: {id: validToken.user.id}})

		if(!user) throw new HttpException(400, 'User Invalid')

		const newToken = createToken(user.id)

		return {accessToken: newToken, refreshToken: validToken.token}
	}

	async logout(token): Promise<void>{
		const rTokenRepo = this.dataSource.getRepository(RefreshToken)

		await rTokenRepo.delete(token)
	}

	async changePassword(userId, oldPassword, newPassword): Promise<void>{
		const userRepo = this.dataSource.getRepository(User)
		const rTokenRepo = this.dataSource.getRepository(RefreshToken)


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
