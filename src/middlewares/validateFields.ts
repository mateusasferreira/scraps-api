import { User } from '@models/User'
import { body, param } from 'express-validator'
import { getRepository } from 'typeorm'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
				.custom(password => {
					const passwordMatch = password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)

					if(!passwordMatch) throw new Error('Password must be at least 8 caracters long, one uppercase and one number')

					return true
				}),
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
				.withMessage('password missing'),
			body('user')
				.exists()
				.withMessage('user missing')
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
				.withMessage('password missing')
				.custom(password => {
					const passwordMatch = password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)

					if(!passwordMatch) throw new Error('Password must be at least 8 caracters long, one uppercase and one number')

					return true
				}),
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
	case('create-scrap'): 
		return [
			body('content')
				.exists()
				.withMessage('content is required'),
			param('receiverId')
				.exists()
				.withMessage('receiverId param is required')
		]
	case('update-scrap'): 
		return [
			body('content')
				.exists()
				.withMessage('content is required'),
			param('id')
				.exists()
				.withMessage('scrap id is missing')
		]
	case('delete-scrap'): 
		return [
			body('content')
				.exists()
				.withMessage('content is required'),
			param('id')
				.exists()
				.withMessage('scrap id is missing')
		]
	case('get-scrap'):
		return [
			param('id')
				.exists()
				.withMessage('scrap id is missing')
		]
	}
}