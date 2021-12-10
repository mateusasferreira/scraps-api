import { Request, Response } from 'express'
import UserService from '@services/UserService'

class UserController {
	async create(req: Request, res: Response): Promise<void> {
		try {
			await UserService.create(req.body)

			res.status(201).json({ message: 'sucessfully created new user' })
		} catch (e) {
			console.log(e)
			res.status(400).json({ message: 'could not create user' })
		}
	}

	async login(req: Request, res: Response) {
		try {
			const { accessToken, refreshToken } = await UserService.login(req.body)

			res.status(200).json({
				auth: true,
				accessToken,
				refreshToken,
			})
		} catch (e) {
			console.log(e)
			res.status(401).json({ message: e.message })
		}
	}

	async refreshToken(req: Request, res: Response) {
		try {
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
			res.status(401).json({ message: 'login required' })
		}
	}

	async logout(req: Request, res: Response) {
		try {
			const { refreshToken } = req.body
			await UserService.logout(refreshToken)
			res.status(200).json({ message: 'succesfully logged out' })
		} catch (e) {
			console.log(e)
			res.status(400).json({ message: e.message })
		}
	}

	async recoverPassword(req: Request, res: Response) {
		try {
			const { email } = req.body

			if (!email) throw new Error('email is missing')

			await UserService.recoverPassword(req.body.email)

			res.status(200).json({ message: 'recovery password created' })
		} catch (e) {
			res.status(400).json({ message: e.message })
		}
	}

	async changePassword(req: Request, res: Response) {
		try {
			const {user, oldPassword, newPassword } = req.body

			await UserService.changePassword(user.id, oldPassword, newPassword)

			res.status(200).json({message: 'password changed'})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: e.message})
		}
	}

	async delete(req: Request, res: Response){
		try {
			const {id} = req.body

			await UserService.delete(id)
		} catch (e) {
			console.log(e)
			res.status(400).json({message: e.message})
		}
		res.sendStatus(200)
	}
}

export default new UserController()
