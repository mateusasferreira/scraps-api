import bcrypt from 'bcrypt'
import { User } from '@models/User'
import { Follow } from '@models/Follow'
import { HttpException } from '@utils/httpException'
import { Service } from 'typedi'
import { CreateUserDto, UserSearchOptions } from './user.dtos'
import {DataSource} from 'typeorm'
import { Profile } from '../../models/Profile'
import { Paginated } from '../../utils/pagination'

@Service()
export class UserService {

	constructor(private dataSource: DataSource){}

	async getOne(id): Promise<User>{
		const userRepo = this.dataSource.getRepository(User)

		const user = await userRepo
			.createQueryBuilder()
			.select([
				'user.username',
				'user.id',
				'user.email',
				'user.created_at',
				'profile.name'
			])
			.from(User, 'user')
			.leftJoin(Profile, 'profile', 'profile.userId = user.id')
			.loadRelationCountAndMap('user.scraps_received', 'user.scraps_received' )
			.loadRelationCountAndMap('user.scraps_sent', 'user.scraps_sent')
			.loadRelationCountAndMap('user.followers', 'user.followedBy')
			.loadRelationCountAndMap('user.following', 'user.following')
			.where('user.id = :id', {id})
			.getOne()

		if(!user) throw new HttpException(404, 'User not found')

		return user
	}

	async getMany(options: UserSearchOptions): Promise<Paginated<User>>{
		const userRepo = this.dataSource.getRepository(User)

		const query = this.dataSource
			.createQueryBuilder()
			.select([
				'user.username',
				'user.id',
				'user.email',
				'user.created_at',
				'profile.name'
			])
			.from(User, 'user')
			.leftJoin(Profile, 'profile', 'profile.userId = user.id')
			.loadRelationCountAndMap('user.scraps_received', 'user.scraps_received' )
			.loadRelationCountAndMap('user.scraps_sent', 'user.scraps_sent')
			.loadRelationCountAndMap('user.followers', 'user.followedBy')
			.loadRelationCountAndMap('user.following', 'user.following')
			.where(builder => {
				if(options.username) {
					builder.where(`lower(user.username) like :username`, {username: `%${options.username}%`} )
				}
		})
			
		if(options.limit) {
			query.take(parseInt(options.limit))
		}
		
		if(options.page) {
			query.skip((parseInt(options.page) - 1) * parseInt(options.limit))
		}

		if(options.orderBy) {
			const direction = options.direction || 'ASC'
			switch (options.orderBy) {
				case 'username':
					query.orderBy('user.username', direction)
					break;
				case 'email':
					query.orderBy('user.email', direction)
					break;
				default:
					query.orderBy('user.username', direction)
					break;
			}
		}

		const total = await userRepo.count()

		const data = await query.getMany()

		return {
			data,
			total 
		}
	}

	async create(data: CreateUserDto): Promise<User>{
		const userRepo = this.dataSource.getRepository(User)

		const passwordHash = await bcrypt.hash(data.password, 8)

		data.password = undefined
			
		const user = await userRepo.create({
			username: data.username, 
			email: data.email,
			password_hash: passwordHash
		})
    
		await userRepo.save(user)

		return user
	}

	async delete(id): Promise<void>{
		const userRepo = this.dataSource.getRepository(User)

		await userRepo.delete(id)
	}

	async follow(follower, followingId): Promise<void>{
		const userRepo = this.dataSource.getRepository(User)
		const followRepo = this.dataSource.getRepository(Follow)

		if(follower.id === followingId) throw new HttpException(400, 'Users are not allowed to follow themselves')

		const following = await userRepo.findOne(followingId)

		if(!following) throw new HttpException(400, 'User doesn\'t exists anymore')

		const follow = await followRepo.create({
			follower, 
			following
		})

		await followRepo.save(follow)
	}
  
	async unfollow(followingId): Promise<void>{
		const followRepo = this.dataSource.getRepository(Follow)
		const userRepo = this.dataSource.getRepository(User)

		const following = await userRepo.findOne(followingId)

		await followRepo.delete({following}) 
	}
}