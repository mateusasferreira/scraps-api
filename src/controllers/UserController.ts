import { Request, Response } from 'express'
import { getCustomRepository, } from 'typeorm'
import { UserRepository } from '@repositories/UserRepository'

class UserController {
	async create(req: Request, res: Response): Promise<void>{
		try {
			const userRepo = getCustomRepository(UserRepository)

			const {username, email, password} = req.body
      
			const user = await userRepo.create()

			user.username = username
			user.email = email
			user.password_hash = password

			await userRepo.save(user)

			res.status(201).json({message: 'sucessfully created new user'})

		} catch(e){
			console.log(e)
			res.status(401).json({message: 'could not create user'})
		}
	}
}

export default new UserController()