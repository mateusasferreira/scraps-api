import { Request, Response } from 'express'
import UserService from '@services/UserService'
import { validationResult } from 'express-validator'

class UserController {
	async get(req: Request, res: Response){
		try {
			const {username} = req.params

			const profile = await UserService.get(username)

			res.status(200).json(profile)
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

			await UserService.create(req.body)

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

			const { accessToken, refreshToken } = await UserService.login(req.body)

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
        await UserService.validateRefreshToken(token)

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
			await UserService.logout(refreshToken)
			res.status(200).json({ message: 'succesfully logged out' })
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{ message: e.message}] })
		}
	}

	async recoverPassword(req: Request, res: Response) {
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array().map((error) => {
						return { message: error.msg }
					}),
				})
			}

			const { email } = req.body

			await UserService.recoverPassword(email)

			res.status(200).json({ message: 'recovery password created' })
		} catch (e) {
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

			await UserService.changePassword(user.id, oldPassword, newPassword)

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

			await UserService.delete(id)

			res.status(200).json({message: 'sucessfully deleted user'})
		} catch (e) {
			console.log(e)
			res.status(400).json({errors: [{ message: e.message}] })
		}
	}
}

export default new UserController()
