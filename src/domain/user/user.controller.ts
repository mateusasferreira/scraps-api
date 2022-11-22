import { NextFunction, Request, Response } from 'express'
import {UserService} from '@domain/user/user.service'
import { validationResult } from 'express-validator'
import scrapsService from '@domain/scrap/scrap.service'
import { Service } from 'typedi'
import { nextTick } from 'process'

@Service()
export class UserController {
	constructor(private userService: UserService) {}
	
	async get(req: Request, res: Response, next: NextFunction){
		try {
			const {id} = req.params

			const user = await this.userService.getOne(id)
	
			res.status(200).json(user)
		} catch(error) {
			next(error)
		}
	}

	async getMany(req: Request, res: Response, next: NextFunction){
		try {
			const response = await this.userService.getMany(req.query)

			res.status(200).json(response)
		} catch (error) {
			next(error)
		}
		
	}

	async getScraps(req: Request, res: Response, next: NextFunction){
		try {
			const {id} = req.params

			const {limit, skip} = req.body

			const [results, total] = await scrapsService.getManyByUser(id, {limit, skip})

			res.status(200).json({
				total,
				results
			})
		} catch (error) {
			next(error)
		}
	}
	
	async create(req: Request, res: Response, next: NextFunction) {
		try {
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
		} catch (error) {
			next(error)
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
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

			res.sendStatus(204)
		} catch (error) {
			next(error)
		}
	}

	async follow(req: Request, res: Response, next: NextFunction){
		try {
			const {id: followingId} = req.params 

			await this.userService.follow(req.user, followingId)

			res.sendStatus(201)
		} catch (error) {
			next(error)
		}
	}
  
	async unfollow(req: Request, res: Response, next: NextFunction){
		try {
			const {id} = req.params

			await this.userService.unfollow(id)

			res.sendStatus(204)
		} catch (error) {
			next(error)
		}
	}
}
