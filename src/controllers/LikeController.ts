import LikeService from '@services/LikeService'
import { Request, Response } from 'express'
// import { validationResult } from 'express-validator'

class LikeController {
	async like(req: Request, res: Response){
		try {
			const {user, scrap: scrapId} = req.body
      
			await LikeService.like(scrapId, user.id)

			res.sendStatus(201)
		} catch (e) {
			console.log()
			res.status(400).json({errors: [{ message: e.message}] })
		}
	}

	async dislike(req: Request, res: Response){
		try {
			const {id} = req.params

			await LikeService.dislike(id)

			res.sendStatus(200)
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{ message: 'Failed occorred'}] })
		}
	}
}

export default new LikeController()