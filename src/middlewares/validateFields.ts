import { body } from 'express-validator'

export default function validate(method: string){
	switch (method) {
	case 'create-user':
		return [
			body('email')
				.exists()
				.withMessage('email missing')
				.isEmail()
				.withMessage('email is not valid')
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
		]
	}
}