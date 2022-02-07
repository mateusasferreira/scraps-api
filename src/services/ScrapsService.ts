import { Scrap } from '@models/Scrap'
import { getRepository } from 'typeorm'

class ScrapService {
	async getOne(scrapId): Promise<Scrap> {
		const scrapRepo = getRepository(Scrap)

		const scrap = await scrapRepo
			.createQueryBuilder('scraps')
			.select([
				'scraps.id',
				'scraps.created_at',
				'scraps.content',
				'sender.username',
				'sender.id',
				'receiver.username',
				'receiver.id',
			])
			.where('scraps.id = :scrapId', { scrapId })
			.leftJoin('scraps.sender', 'sender')
			.leftJoin('scraps.receiver', 'receiver')
			.loadRelationCountAndMap('scraps.likes', 'scraps.likes')
			.getOne()

		return scrap
	}

	async getManyByUser(userId, options): Promise<[Scrap[], number]> {
		const scrapRepo = getRepository(Scrap)

		const scraps = await scrapRepo
			.createQueryBuilder('scraps')
			.select([
				'scraps.id',
				'scraps.created_at',
				'scraps.content',
				'sender.username',
				'sender.id',
				'receiver.username',
				'receiver.id',
			])
			.where('scraps.receiver = :userId', { userId })
			.leftJoin('scraps.sender', 'sender')
			.leftJoin('scraps.receiver', 'receiver')
			.loadRelationCountAndMap('scraps.likes', 'scraps.likes')
			.orderBy('scraps.created_at', 'ASC' )
			.take(options.limit)
			.skip(options.skip)
			.getMany()

		const count = await scrapRepo.count()

		return [scraps, count]
	}

	async create(options: Partial<Scrap>): Promise<Scrap> {
		const scrapRepo = getRepository(Scrap)

		const scrap = await scrapRepo.create({
			content: options.content,
			senderId: options.senderId,
			receiverId: options.receiverId,
		})

		await scrapRepo.save(scrap)

		return scrap
	}

	async update(scrapId, newContent, user): Promise<Scrap> {
		const scrapRepo = getRepository(Scrap)

		const oldScrap = await scrapRepo.findOne(scrapId)

		if (oldScrap.senderId !== user.id)
			throw new Error('Only the scrap creator can do this operation')

		await scrapRepo.update(scrapId, {
			content: newContent,
		})

		const updatedScrap = await scrapRepo.findOne(scrapId)

		return updatedScrap
	}

	async delete(scrapId, user): Promise<void> {
		const scrapRepo = getRepository(Scrap)

		const scrap = await scrapRepo.findOne(scrapId)

		if (user.id !== scrap.senderId && user.id !== scrap.receiverId)
			throw new Error('Caller is not scrap creator nor receiver')

		await scrapRepo.delete(scrap.id)
	}
}

export default new ScrapService()
