import profileService from '@services/profileService'
import { Request, Response } from 'express'
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
			
			const profile = await profileService.create({
				file: req.file,
				name: req.body.name,
				bio: req.body.bio,
				birth_date: req.body.birth_date,
				location: req.body.location,
				user: req.body.user
			})
			
			res.status(200).json(profile)
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{ message: e.message}] })
		} 
	}

	async getMyProfile(req: Request, res: Response){
		try {
			const {user} = req.body
			
			const profile = await profileService.getMyProfile(user)

			res.status(200).json(profile)
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

			const profile = await profileService.update({
				file: req.file,
				name: req.body.name,
				bio: req.body.bio,
				birth_date: req.body.birth_date,
				location: req.body.location,
				user: req.body.user
			})

			res.status(200).json(profile)
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