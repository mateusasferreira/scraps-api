import { Follow } from '@models/Follow'
import { User } from '@models/User'
import { getRepository } from 'typeorm'
import { HttpException } from '../utils/httpException'

class FollowService {
	async follow(follower, followingId): Promise<void>{
		const userRepo = getRepository(User)
		const followRepo = getRepository(Follow)

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
		const userRepo = getRepository(User)

		const following = await userRepo.findOne(followingId)

		await followRepo.delete({following}) 
	}
}

export default new FollowService()