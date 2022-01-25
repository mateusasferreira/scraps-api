import FollowService from '@services/FollowService'
import { Request, Response } from 'express'

class FollowController {
	async follow(req: Request, res: Response){
		try {
			const {id: followingId} = req.params 
			const {user: follower} = req.body

			await FollowService.follow(follower, followingId)

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