import followService from '@services/followService'
import { Request, Response } from 'express'

class FollowController {
	async follow(req: Request, res: Response){
		const {id: followingId} = req.params 

		await followService.follow(req.user, followingId)

		res.sendStatus(201)
	}
  
	async unfollow(req: Request, res: Response){
		const {id} = req.params

		await followService.unfollow(id)

		res.sendStatus(204)
	}
}

export default new FollowController()