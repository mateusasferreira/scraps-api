import bcrypt from 'bcrypt'
import { User } from '@models/User'
import { Service } from 'typedi'
import { Paginated } from '@interfaces/IPaginated'
import { UserSearchOptions } from './interfaces/IUserSearchOptions'
import { CreateUserPayload } from './interfaces/ICreateUserPayload'
import { UserDao } from './interfaces/UserDao'
import { NotFoundError, ValidationError } from '@utils/errors'

@Service()
export class UserService {

	constructor(private userDao: UserDao){}

	async getOne(id): Promise<User>{
		const user = await this.userDao.findOne(id)

		if(!user) throw new NotFoundError('User not found')

		return user
	}

	async getMany(options: UserSearchOptions): Promise<Paginated<User>>{
		const users = await this.userDao.find(options)

		const total = await this.userDao.count(options)

		return {
			data: users,
			total 
		}
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
}