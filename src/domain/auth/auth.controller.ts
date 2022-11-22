import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { AuthService } from '@domain/auth/auth.service'
import { Service } from 'typedi'

@Service()
export class AuthController {
	constructor( private authService: AuthService ) { }

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array().map((error) => {
						return { message: error.msg }
					}),
				})
			}
	
			const { accessToken, refreshToken } = await this.authService.login(req.body)
	
			res.status(200).json({
				auth: true,
				accessToken,
				refreshToken,
			})		
		} catch (error) {
			next(error)
		}
	}

	async refreshToken(req: Request, res: Response, next: NextFunction) {
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
					await this.authService.validateRefreshToken(token)

			res.status(200).json({
				auth: true,
				accessToken,
				refreshToken,
			})
		} catch (error) {
			next(error)
		}
	}

	async logout(req: Request, res: Response, next: NextFunction) {
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
				
			await this.authService.logout(refreshToken)

			res.sendStatus(200)
		} catch (error) {
			next(error)
		}
	}

	async changePassword(req: Request, res: Response, next: NextFunction) {
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array().map((error) => {
						return { message: error.msg }
					}),
				})
			}

			const { oldPassword, newPassword } = req.body

			await this.authService.changePassword(req.user.id, oldPassword, newPassword)

			res.status(200).json({ message: 'password changed' })
		} catch (error) {
			next(error)
		}
	}
}
