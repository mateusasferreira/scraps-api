import { body } from "express-validator";

export default function validate(method) {
  switch (method) {
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
  }
}