import ProfileService from '@services/ProfileService'
import { Request, Response } from 'express'
import fs from 'fs'

class ProfileController {
	async create(req: Request, res: Response){
		try {
			await ProfileService.create({
				file: req.file,
				name: req.body.name,
				bio: req.body.bio,
				birth_date: req.body.birth_date,
				location: req.body.location,
				user: req.body.user
			})
			
			res.sendStatus(200)
		} catch (e) {
			console.log(e)
			res.status(400).json({message: e.message})
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