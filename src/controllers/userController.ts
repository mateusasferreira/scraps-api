import { Request, Response } from 'express'
import userService from '@services/userService'
import { validationResult } from 'express-validator'
import scrapsService from '@services/scrapsService'

class UserController {
	async get(req: Request, res: Response){
		try {
			const {username} = req.params

			const user = await userService.getOne(username)

			res.status(200).json(user)
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{message: e.message}]})
		}
	}

	async getMany(req: Request, res: Response){
		try {

			const {limit, skip} = req.body
			
			const [results, total] = await userService.getMany({limit, skip})

			res.status(200).json({
				total,
				results
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{message: e.message}]})
		}
	}

	async getScraps(req: Request, res: Response){
		try {
			const {id} = req.params

			const {limit, skip} = req.body

			const [results, total] = await scrapsService.getManyByUser(id, {limit, skip})

			res.status(200).json({
				total,
				results
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{message: e.message}]})
		}
	}
	
	async create(req: Request, res: Response) {
		try {
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
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{ message: e.message}] })
		}
	}

	async login(req: Request, res: Response) {
		try {
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
		} catch (e) {
			console.log(e)
			res.status(401).json({errors: [{ message: e.message}] })
		}
	}

	async refreshToken(req: Request, res: Response) {
		try {
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
		} catch (e) {
			console.log(e)
			res.status(401).json({errors: [{ message: e.message}] })
		}
	}

	async logout(req: Request, res: Response) {
		try {
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
			res.status(200).json({ message: 'succesfully logged out' })
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{ message: e.message}] })
		}
	}

	async changePassword(req: Request, res: Response) {
		try {
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
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{ message: e.message}] })
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array().map((error) => {
						return { message: error.msg }
					}),
				})
			}

			const { id } = req.body

			await userService.delete(id)

			res.status(200).json({message: 'sucessfully deleted user'})
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{ message: e.message}] })
		}
	}
}

export default new UserController()
