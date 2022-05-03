import { Request, Response } from 'express'
import userService from '@services/userService'
import { validationResult } from 'express-validator'
import scrapsService from '@services/scrapsService'
import { HttpException } from '../utils/httpException'

class UserController {
	async get(req: Request, res: Response){
		const {username} = req.params

		const user = await userService.getOne(username)

		if(!user) throw new HttpException(404, 'User not found')

		res.status(200).json(user)
	}

	async getMany(req: Request, res: Response){
		const {limit, skip} = req.body
			
		const [results, total] = await userService.getMany({limit, skip})

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
			return res.status(400).json({
				errors: errors.array().map((error) => {
					return { message: error.msg }
				}),
			})
		}

		await userService.create(req.body)

		res.status(201).json({ message: 'sucessfully created new user' })
	}

	async login(req: Request, res: Response) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array().map((error) => {
					return { message: error.msg }
				}),
			})
		}

		const { accessToken, refreshToken } = await userService.login(req.body)

		res.status(200).json({
			auth: true,
			accessToken,
			refreshToken,
		})
	}

	async refreshToken(req: Request, res: Response) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array().map((error) => {
					return { message: error.msg }
				}),
			})
		}

		const { token } = req.body

		const { accessToken, refreshToken } =
        await userService.validateRefreshToken(token)

		res.status(200).json({
			auth: true,
			accessToken,
			refreshToken,
		})
	}

	async logout(req: Request, res: Response) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array().map((error) => {
					return { message: error.msg }
				}),
			})
		}

		const { refreshToken } = req.body
			
		await userService.logout(refreshToken)

		res.sendStatus(200)
	}

	async changePassword(req: Request, res: Response) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array().map((error) => {
					return { message: error.msg }
				}),
			})
		}

		const { user, oldPassword, newPassword } = req.body

		await userService.changePassword(user.id, oldPassword, newPassword)

		res.status(200).json({ message: 'password changed' })
	}

	async delete(req: Request, res: Response) {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array().map((error) => {
					return { message: error.msg }
				}),
			})
		}

		const { id } = req.body.user

		await userService.delete(id)

		res.status(204).json({message: 'sucessfully deleted user'})
	}
}

export default new UserController()
