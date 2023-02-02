import { body } from "express-validator";

export function validate(method) {
	switch (method) {
		case "create-user":
			return [
				body("email")
					.exists()
					.withMessage("email missing")
					.isEmail(),
				body("password")
					.exists()
					.withMessage("password missing")
					.custom((password) => {
						const passwordMatch = password.match(
							/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
						);

						if (!passwordMatch)
							throw new Error(
								"Password must be at least 8 caracters long, one uppercase and one number"
							);

						return true;
					}),
				body("username")
					.exists()
					.withMessage("username missing")
					.isLength({ min: 4, max: 20 })
					.withMessage("username must be 8 to 20 characters long")
				];
		}
	}