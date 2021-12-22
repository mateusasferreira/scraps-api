import ProfileService from '@services/ProfileService'
import { Request, Response } from 'express'
import fs from 'fs'
import { validationResult } from 'express-validator'
import S3Service from '@services/external/s3'

class ProfileController {
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
			
			await ProfileService.create({
				file: req.file,
				name: req.body.name,
				bio: req.body.bio,
				birth_date: req.body.birth_date,
				location: req.body.location,
				user: req.body.user
			})
			
			res.status(200).json({message: 'profile created sucessfully'})
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{ message: e.message}] })
		} 
	}

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

			const profile = await ProfileService.get(id)

			res.status(200).json({profile})
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{message: e.message}]})
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

			await ProfileService.update({
				file: req.file,
				name: req.body.name,
				bio: req.body.bio,
				birth_date: req.body.birth_date,
				location: req.body.location,
				user: req.body.user
			})

			res.status(200).json({message: 'successfully updated profile'})
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{message: e.message}]})
		}
	}

	async getImageStream(req: Request, res: Response){
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array().map((error) => {
						return { message: error.msg }
					}),
				})
			}

			const {key} = req.params

			const imageStream = await S3Service.getFileStream(key)

			imageStream.pipe(res)
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{message: e.message}]})
		}
	}
}

export default new ProfileController()