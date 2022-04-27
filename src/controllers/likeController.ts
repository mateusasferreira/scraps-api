import likeService from '@services/likeService'
import { Request, Response } from 'express'
// import { validationResult } from 'express-validator'

class LikeController {
	async like(req: Request, res: Response){
		const {id: scrapId} = req.params
		const {user} = req.body
      
		await likeService.like(scrapId, user)

		res.sendStatus(201)
	}

	async dislike(req: Request, res: Response){
		const {id: scrapId} = req.params

		await likeService.dislike(scrapId)

		res.sendStatus(200)
	}
}

export default new LikeController()