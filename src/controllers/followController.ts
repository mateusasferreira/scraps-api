import followService from '@services/followService'
import { Request, Response } from 'express'

class FollowController {
	async follow(req: Request, res: Response){
		const {id: followingId} = req.params 
		const {user: follower} = req.body

		await followService.follow(follower, followingId)

		res.sendStatus(201)
	}
  
	async unfollow(req: Request, res: Response){
		const {id} = req.params

		await followService.unfollow(id)

		res.sendStatus(200)
	}
}

export default new FollowController()