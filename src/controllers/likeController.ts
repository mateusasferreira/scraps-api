import likeService from '@services/likeService'
import { Request, Response } from 'express'
// import { validationResult } from 'express-validator'

class LikeController {
	async like(req: Request, res: Response){
		try {
			const {id: scrapId} = req.params
			const {user} = req.body
      
			await likeService.like(scrapId, user)

			res.sendStatus(201)
		} catch (e) {
			console.log()
			res.status(400).json({errors: [{ message: e.message}] })
		}
	}

	async dislike(req: Request, res: Response){
		try {
			const {id: scrapId} = req.params

			await likeService.dislike(scrapId)

			res.sendStatus(200)
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{ message: 'Failed occorred'}] })
		}
	}
}

export default new LikeController()