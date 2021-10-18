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
}

export default new UserController()