import { Request, Response } from 'express'
import UserService from '@services/UserService'

class UserController {
	async create(req: Request, res: Response): Promise<void>{
		try {

			await UserService.create(req.body)

			res.status(201).json({message: 'sucessfully created new user'})

		} catch(e){
			console.log(e)
			res.status(401).json({message: 'could not create user'})
		}
	}

	async login(req: Request, res: Response){
		try {
			const token = await UserService.login(req.body)
			
			res.status(200).json({
				auth: true,
				token: token
			})
		} catch(e){
			console.log(e)
			res.status(400).json(e.message)
		}
	}
}

export default new UserController()