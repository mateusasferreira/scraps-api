import { User } from '@models/User'
import { body, param } from 'express-validator'
import { getRepository } from 'typeorm'

export default function validate(method: string) {
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
	case 'logout':
		return [
			body('refreshToken')
				.exists()
				.withMessage('missing refresh token'),
		]
	case 'recover-password': 
		return [
			body('email')
				.exists()
				.withMessage('email is missing')
				.isEmail()
				.withMessage('invalid email')
		]
	case 'change-password':
		return [
			body('oldPassword')
				.exists()
				.withMessage('current password missing'),
			body('newPassword')
				.exists()
				.withMessage('new password password missing')
				.isLength({min: 8, max: 20})
				.withMessage('password must be 8 to 20 characters long')
		]
	case 'confirm-email':
		return [
			param('id')
				.exists()
				.withMessage('id is missing')
		]
	case 'refresh-token':
		return [
			body('token')
				.exists()
				.withMessage('token is missing')
		]
	case('create-profile'):
		return [
			body('name')
				.exists()
				.withMessage('name is missing'),
			body('bio')
				.exists()
				.withMessage('bio is missing'),
			body('birth_date')
				.exists()
				.withMessage('birth date is missing')
		]
	case('retrieve-profile'):
		return [
			param('id')
				.exists()
				.withMessage('id param is missing')		
		]
	case('get-image-stream'):
		return [
			param('key')
				.exists()
				.withMessage('image key param is missing')
		]
	}
}