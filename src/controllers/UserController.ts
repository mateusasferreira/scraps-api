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
			const {accessToken, refreshToken} = await UserService.login(req.body)
			
			res.status(200).json({
				auth: true,
				accessToken,
				refreshToken
			})
		} catch(e){
			console.log(e)
			res.status(401).json({message: e.message})
		}
	}

	async refreshToken(req: Request, res: Response){
		try {
			const {token} = req.body

			const {accessToken, refreshToken} = await UserService.validateRefreshToken(token)

			res.status(200).json({
				auth: true,
				accessToken,
				refreshToken
			})
		} catch(e){
			console.log(e)
			res.status(401).json({message: 'login required'})
		}
	}
}

export default new UserController()