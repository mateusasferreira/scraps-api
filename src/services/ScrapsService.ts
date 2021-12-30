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
}

export default new ScrapService()