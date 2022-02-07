import { Like } from '@models/Like'
import { Scrap } from '@models/Scrap'
import { getRepository } from 'typeorm'

class LikeService {
	async like(scrapId, user): Promise<void>{
		const scrapRepo = getRepository(Scrap)
		const likeRepo = getRepository(Like)

		const scrap = await scrapRepo.findOne(scrapId)

		if(!scrap) throw new Error('scrap is not available')

		const like = likeRepo.create({
			user, 
			scrap
		})

		await likeRepo.save(like)
	}

	async dislike(scrapId): Promise<void>{
		const likeRepo = getRepository(Like)
		const scrapRepo = getRepository(Scrap)

		const scrap = await scrapRepo.findOne(scrapId)
		
		await likeRepo.delete({scrap})
	}
}

export default new LikeService()