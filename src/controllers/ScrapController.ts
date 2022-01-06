import ScrapsService from '@services/ScrapsService'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'

class ScrapController {
	async get(req: Request, res: Response){
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array().map((error) => {
						return { message: error.msg }
					}),
				})
			}

			const {id} = req.params

			const scrap = await ScrapsService.get(id)

			res.status(200).json(scrap)
		} catch (e) {
			console.log()
			res.status(400).json({errors: [{ message: e.message}] })
		}
	}
	
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

	async update(req: Request, res: Response){
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array().map((error) => {
						return { message: error.msg }
					}),
				})
			}

			const {id} = req.params

			const {content, user} = req.body

			const scrap = await ScrapsService.update(id, content, user)

			res.status(200).json(scrap)
		} catch (e) {
			console.log()
			res.status(400).json({errors: [{ message: e.message}] })
		}
	}

	async delete(req: Request, res: Response){
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array().map((error) => {
						return { message: error.msg }
					}),
				})
			}

			const {id} = req.params

			const {user} = req.body

			await ScrapsService.delete(id, user)

			res.status(200).json({message: 'succesfully deleted scrap'})
		} catch (e) {
			console.log()
			res.status(400).json({errors: [{ message: e.message}] })
		}
	}
} 

export default new ScrapController()