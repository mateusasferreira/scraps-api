import { Request, Response } from 'express'
import { getCustomRepository, } from 'typeorm'
import { UserRepository } from '@repositories/UserRepository'
import bcrypt from 'bcrypt'

class UserController {
	async create(req: Request, res: Response): Promise<void>{
		try {
			const userRepo = getCustomRepository(UserRepository)

			const data = req.body

			const passwordHash = await bcrypt.hash(data.password, 8)

			data.password = undefined
			
			const user = await userRepo.create({
				username: data.username, 
				email: data.email,
				password_hash: passwordHash
			})

			await userRepo.save(user)

			res.status(201).json({message: 'sucessfully created new user'})

		} catch(e){
			console.log(e)
			res.status(401).json({message: 'could not create user'})
		}
	}
}

export default new UserController()