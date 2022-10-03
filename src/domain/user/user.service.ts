import bcrypt from 'bcrypt'
import { User } from '@models/User'
import { Follow } from '@models/Follow'
import { HttpException } from '@utils/httpException'
import { Service } from 'typedi'
import { CreateUserDto, UserSearchOptions } from './user.dtos'
import {DataSource} from 'typeorm'
import { Profile } from '../../models/Profile'

@Service()
export class UserService {

	constructor(private dataSource: DataSource){}

	async getOne(username): Promise<User>{
		const userRepo = this.dataSource.getRepository(User)

		const profile = await userRepo
			.createQueryBuilder('user')
			.select([
				'user.id', 
				'user.username', 
				'user.created_at', 
				'user.email', 
				'profile.name', 
				'profile.bio'])
			.leftJoin('user.profile', 'profile')
			.where('user.username = :username', {username})
			.loadRelationCountAndMap('user.scraps_received', 'user.scraps_received' )
			.loadRelationCountAndMap('user.scraps_sent', 'user.scraps_sent')
			.loadRelationCountAndMap('user.followers', 'user.followedBy')
			.loadRelationCountAndMap('user.follows', 'user.following')
			.getOne()

		return profile
	}

	async getMany(options: UserSearchOptions): Promise<[User[], number]>{
		const userRepo = this.dataSource.getRepository(User)

		const profile = await this.dataSource
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
					builder.where(`user.username like %:username%`, {username: options.username} )
				}
			})
			.getMany()

		const count = await userRepo.count()

		return [profile, count]
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