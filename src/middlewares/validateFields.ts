import { User } from '@models/User'
import { body } from 'express-validator'
import { getRepository } from 'typeorm'

export default function validate(method: string){
	switch (method) {
	case 'create-user':
		return [
			body('email')
				.exists()
				.withMessage('email missing')
				.isEmail()
				.withMessage('email is not valid')
				.custom(async (email) => {
					const userRepo = getRepository(User)

					const emailIsTaken = await userRepo.findOne({
						where: {email}
					})

					if(emailIsTaken) throw new Error('email is already taken')

					return true
				})
			,
			body('password')
				.exists()
				.withMessage('password missing')
				.isLength({min: 8, max: 20})
				.withMessage('password must be 8 to 20 characters long'),
			body('username')
				.exists()
				.withMessage('username missing')
				.isLength({min: 4, max: 20})
				.withMessage('username must be 8 to 20 characters long')
				.custom(async (username) => {
					const userRepo = getRepository(User)

					const usernameIsTaken = await userRepo.findOne({
						where: {username}
					})

					if(usernameIsTaken) throw new Error('username is already taken')

					return true
				})
		]
	case 'login':
		return [
			body('password')
				.exists()
				.withMessage('password missing')
				.isLength({min: 8, max: 20})
				.withMessage('password must be 8 to 20 characters long'),
			body('username')
				.exists()
				.withMessage('username missing')
				.isLength({min: 4, max: 20})
				.withMessage('username must be 8 to 20 characters long')
		]
	}
}