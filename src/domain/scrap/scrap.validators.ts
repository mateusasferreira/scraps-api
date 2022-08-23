import { body, param } from "express-validator"

export default function validate(method) {
  switch (method) {
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