import ScrapsService from '@services/ScrapsService'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'

class ScrapController {
	async create(req: Request, res: Response){
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array().map((error) => {
						return { message: error.msg }
					}),
				})
			}

			const {user, content} = req.body

			const {receiverId} = req.params

			const scrap = await ScrapsService.create({
				content,
				senderId: user.id, 
				receiverId
			})

			res.status(201).json(scrap)
		} catch (e) {
			console.log()
			res.status(400).json({errors: [{ message: e.message}] })
		}
	}
} 

export default new ScrapController()