import FollowService from '@services/FollowService'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'

class FollowController {
	async follow(req: Request, res: Response){
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array().map((error) => {
						return { message: error.msg }
					}),
				})
			}

			const {user, userId: followingId} = req.body

			await FollowService.follow(user, followingId)

			res.sendStatus(201)
		} catch (e) {
			console.log()
			res.status(400).json({errors: [{ message: e.message}] })
		}
	}
  
	async unfollow(req: Request, res: Response){
		try {
			const {id} = req.params

			await FollowService.unfollow(id)

			res.sendStatus(200)
		} catch (e) {
			console.log()
			res.status(400).json({errors: [{ message: e.message}] })
		}
	}
}

export default new FollowController()