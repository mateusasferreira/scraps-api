import { Request, Response } from 'express'
import {UserService} from '@domain/user/user.service'
import { validationResult } from 'express-validator'
import scrapsService from '@domain/scrap/scrap.service'
import { HttpException } from '@utils/httpException'
import { Service } from 'typedi'

@Service()
export class UserController {
	constructor(private userService: UserService) {}
	
	async get(req: Request, res: Response){
		const {username} = req.params

		const user = await this.userService.getOne(username)

		if(!user) throw new HttpException(404, 'User not found')

		res.status(200).json(user)
	}

	async getMany(req: Request, res: Response){
		const {limit, skip} = req.body
			
		const [results, total] = await this.userService.getMany({limit, skip})

		res.status(200).json({
			total,
			results
		})
	}

	async getScraps(req: Request, res: Response){
		const {id} = req.params

		const {limit, skip} = req.body

		const [results, total] = await scrapsService.getManyByUser(id, {limit, skip})

		res.status(200).json({
			total,
			results
		})
	}
	
	async create(req: Request, res: Response) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			res.status(400).json({
				errors: errors.array().map((error) => {
					return { message: error.msg }
				}),
			})

			return
		}

		await this.userService.create(req.body)

		res.status(201).json({ message: 'sucessfully created new user' })
	}

	async delete(req: Request, res: Response) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			res.status(400).json({
				errors: errors.array().map((error) => {
					return { message: error.msg }
				}),
			})

			return;
		}

		const { id } = req.user

		await this.userService.delete(id)

		res.status(204).json({message: 'sucessfully deleted user'})
	}

	async follow(req: Request, res: Response){
		const {id: followingId} = req.params 

		await this.userService.follow(req.user, followingId)

		res.sendStatus(201)
	}
  
	async unfollow(req: Request, res: Response){
		const {id} = req.params

		await this.userService.unfollow(id)

		res.sendStatus(204)
	}
}
