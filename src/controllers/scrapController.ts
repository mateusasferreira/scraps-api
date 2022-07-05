import scrapsService from '@services/scrapsService'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'

class ScrapController {
	async getOne(req: Request, res: Response){
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array().map((error) => {
					return { message: error.msg }
				}),
			})
		}

		const {id} = req.params

		const scrap = await scrapsService.getOne(id)

		res.status(200).json(scrap)
	}
	
	async create(req: Request, res: Response){
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array().map((error) => {
					return { message: error.msg }
				}),
			})
		}

		const {content} = req.body

		const {receiverId} = req.params

		const scrap = await scrapsService.create({
			content,
			senderId: req.user.id, 
			receiverId
		})

		res.status(201).json(scrap)
	}

	async update(req: Request, res: Response){
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array().map((error) => {
					return { message: error.msg }
				}),
			})
		}

		const {id} = req.params

		const {content} = req.body

		const scrap = await scrapsService.update(id, content, req.user)

		res.status(200).json(scrap)
	}

	async delete(req: Request, res: Response){
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array().map((error) => {
					return { message: error.msg }
				}),
			})
		}

		const {id} = req.params

		await scrapsService.delete(id, req.user)

		res.status(200).json({message: 'succesfully deleted scrap'})
	}
} 

export default new ScrapController()