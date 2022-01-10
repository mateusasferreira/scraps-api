import { Like } from '@models/Like'
import { Scrap } from '@models/Scrap'
import { User } from '@models/User'
import { getRepository } from 'typeorm'

class LikeService {
	async like(scrapId, userId): Promise<void>{
		const scrapRepo = getRepository(Scrap)
		const userRepo = getRepository(User)
		const likeRepo = getRepository(Like)

		const user = await userRepo.findOne(userId)

		if(!user) throw new Error('user not available')
    
		const scrap = await scrapRepo.findOne(scrapId)

		if(!scrap) throw new Error('scrap is not available')

		const like = likeRepo.create({
			user, 
			scrap
		})

		await likeRepo.save(like)
	}

	async dislike(likeId): Promise<void>{
		const likeRepo = getRepository(Like)

		await likeRepo.delete(likeId)
	}
}

export default new LikeService()