import profileService from '@domain/profile/profile.service'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import S3Service from '@services/s3'
import { HttpException } from '@utils/httpException'

class ProfileController {
	async create(req: Request, res: Response){
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
			user: req.user
		})
			
		res.status(201).json(profile)
	}

	async getMyProfile(req: Request, res: Response){
		const profile = await profileService.getMyProfile(req.user)

		if(!profile) throw new HttpException(404, 'No profile found')	

		res.status(200).json(profile)
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

		const profile = await profileService.update({
			file: req.file,
			name: req.body.name,
			bio: req.body.bio,
			birth_date: req.body.birth_date,
			location: req.body.location,
			user: req.user
		})

		res.status(200).json(profile)
	}

	async getImageStream(req: Request, res: Response){
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
	}
}

export default new ProfileController()