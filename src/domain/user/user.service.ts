import { getRepository, } from 'typeorm'
import bcrypt from 'bcrypt'
import { User } from '@models/User'
import { Follow } from '@models/Follow'
import { HttpException } from '@utils/httpException'
import { Service } from 'typedi'
import { Dao } from '../common/data.service'
import { CreateUserDto } from './user.dtos'

@Service()
export class UserService {

	constructor(private dao: Dao){}

	async getOne(username): Promise<User>{
		const userRepo = this.dao.get<User>(User)

		const profile = await userRepo
			.createQueryBuilder('user')
			.select(['user.id', 'user.username', 'user.created_at', 'user.email'])
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
		const userRepo = this.dao.get<User>(User)

		const profile = await userRepo
			.createQueryBuilder('user')
			.select(['user.id', 'user.username', 'user.created_at', 'user.email' ])
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

	async create(data: CreateUserDto): Promise<User>{
		const userRepo = this.dao.get<User>(User)

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
		const userRepo = this.dao.get<User>(User)

		await userRepo.delete(id)
	}

	async follow(follower, followingId): Promise<void>{
		const userRepo = this.dao.get<User>(User)
		const followRepo = this.dao.get<Follow>(Follow)

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
		const followRepo = getRepository(Follow)
		const userRepo = this.dao.get<User>(User)

		const following = await userRepo.findOne(followingId)

		await followRepo.delete({following}) 
	}
}