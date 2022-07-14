import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import userService from '@services/userService'

class AuthController {
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

		const { oldPassword, newPassword } = req.body

		await userService.changePassword(req.user.id, oldPassword, newPassword)

		res.status(200).json({ message: 'password changed' })
	}
}

export default new AuthController()