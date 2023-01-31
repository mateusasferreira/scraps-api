import { NextFunction, Request, Response } from 'express'
import {UserService} from '@domain/user/user.service'
import { validationResult } from 'express-validator'
import { Controller, Delete, Get, Next, Post, Req, Res, Inject } from '@nestjs/common'
import { TYPES } from './user.constants'

@Controller('users')
export class UserController {
	constructor(@Inject(TYPES.USERSERVICE) private userService: UserService) {}
	
	@Get(':id')
	async get(
		@Req() req: Request, 
		@Res() res: Response, 
		@Next() next: NextFunction
	){
		try {
			const {id} = req.params

			const user = await this.userService.getOne(id)
	
			res.status(200).json(user)
		} catch(error) {
			next(error)
		}
	}

	@Get()
	async getMany(
		@Req() req: Request, 
		@Res() res: Response, 
		@Next() next: NextFunction
	){
		try {
			const response = await this.userService.getMany(req.query)

			res.status(200).json(response)
		} catch (error) {
			next(error)
		}
		
	}

	@Get('/scraps')
	async getScraps(
		@Req() req: Request, 
		@Res() res: Response, 
		@Next() next: NextFunction
	){
		try {
			const {id} = req.params

			const result = await this.userService.getScraps(id, req.query)

			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}
	
	@Post()
	async create(
		@Req() req: Request, 
		@Res() res: Response, 
		@Next() next: NextFunction
	) {
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

	@Delete()
	async delete(
		@Req() req: Request, 
		@Res() res: Response, 
		@Next() next: NextFunction
	) {
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

	@Post(':id/follow')
	async follow(
		@Req() req: Request, 
		@Res() res: Response, 
		@Next() next: NextFunction
	){
		try {
			const {id: followingId} = req.params 

			await this.userService.follow(req.user, followingId)

			res.sendStatus(201)
		} catch (error) {
			next(error)
		}
	}
  
	@Post(':id/unfollow')
	async unfollow(
		@Req() req: Request, 
		@Res() res: Response, 
		@Next() next: NextFunction
	){
		try {
			const {id} = req.params

			await this.userService.unfollow(req.user.id, id)

			res.sendStatus(204)
		} catch (error) {
			next(error)
		}
	}
}
