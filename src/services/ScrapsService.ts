import { Scrap } from '@models/Scrap'
import { getRepository } from 'typeorm'

class ScrapService {
	async create(options: Partial<Scrap>): Promise<Scrap>{
		const scrapRepo = getRepository(Scrap)

		const scrap = await scrapRepo.create({
			content: options.content,
			senderId: options.senderId,
			receiverId: options.receiverId
		},)

		await scrapRepo.save(scrap)

		return scrap
	}

	async update(scrapId, newContent, user): Promise<Scrap>{
		const scrapRepo = getRepository(Scrap)
		
		const oldScrap = await scrapRepo.findOne(scrapId)

		if(oldScrap.senderId !== user.id) throw new Error('Only the scrap creator can do this operation')
		
		await scrapRepo.update(scrapId, {
			content: newContent
		})

		const updatedScrap = await scrapRepo.findOne(scrapId)

		return updatedScrap		
	}
}

export default new ScrapService()