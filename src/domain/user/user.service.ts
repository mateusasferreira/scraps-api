import bcrypt from 'bcrypt'
import { User } from '@models/User'
import { Paginated } from '@interfaces/IPaginated'
import { ScrapsSearchOptions, UserSearchOptions } from './interfaces/IUserSearchOptions'
import { CreateUserPayload } from './interfaces/ICreateUserPayload'
import { IUserDao } from './interfaces/IUserDao'
import { NotFoundError, ValidationError } from '@utils/errors'
import { IUserService } from './interfaces/IUserService'
import { Inject, Injectable } from '@nestjs/common'
import { TYPES } from './user.constants'
import { Scrap } from '../../models/Scrap'

@Injectable()
export class UserService implements IUserService {

	constructor(@Inject(TYPES.USERDAO) private userDao: IUserDao){}

	async getOne(id): Promise<User>{
		const user = await this.userDao.findOne(id)

		if(!user) throw new NotFoundError('User not found')

		return user
	}

	getMany(options: UserSearchOptions): Promise<Paginated<User>>{
		return this.userDao.find(options)
	}

	async create(data: CreateUserPayload): Promise<void>{
		const passwordHash = await bcrypt.hash(data.password, 8)

		await this.userDao.insert({
			username: data.username, 
			email: data.email,
			password_hash: passwordHash
		})
	}

	async delete(id): Promise<void>{
		await this.userDao.delete(id)
	}

	async follow(followerId: string, followingId: string): Promise<void>{
		
		if(followerId === followingId) throw new ValidationError('Users are not allowed to follow themselves')

		const isAlreadyFollowing = await this.userDao.checkIsFollowing(followerId, followingId)

		if(isAlreadyFollowing) {
			return
		}
		
		await this.userDao.follow(followerId, followingId)
	}
  
	async unfollow(followerId, followingId): Promise<void>{
		this.userDao.unfollow(followerId, followingId)
	}

	getScraps(id: any, options: ScrapsSearchOptions) {
		return this.userDao.getScraps(id, options)
	};
}