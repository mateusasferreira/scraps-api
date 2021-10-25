import { Request, Response } from 'express'
import UserService from '@services/UserService'

class UserController {
	async create(req: Request, res: Response): Promise<void>{
		try {

			await UserService.create(req.body)

			res.status(201).json({message: 'sucessfully created new user'})

		} catch(e){
			console.log(e)
			res.status(400).json({message: 'could not create user'})
		}
	}

	async login(req: Request, res: Response){
		try {
			const {token, refreshToken} = await UserService.login(req.body)
			
			res.status(200).json({
				auth: true,
				token,
				refreshToken
			})
		} catch(e){
			console.log(e)
			res.status(400).json({message: e.message})
		}
	}

	async refreshToken(req: Request, res: Response){
		try {
			const {token} = req.body

			const newToken = await UserService.refreshToken(token)

			res.status(200).json({token: newToken})
		} catch(e){
			console.log(e)
			res.status(400).json({message: 'login required'})
		}
	}
}

export default new UserController()