import ProfileService from '@services/ProfileService'
import { Request, Response } from 'express'
import fs from 'fs'
import { validationResult } from 'express-validator'

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
		} finally {
			try {
				fs.unlinkSync(req.file.path)
			} catch(e) {
				console.log(e)
			}
		}
	}
}

export default new ProfileController()