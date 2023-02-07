import { body } from "express-validator";

export function validate(method): any {
	switch (method) {
		case "create-user":
			return [
				body("email")
					.exists()
					.withMessage("Email is missing")
					.isEmail()
					.withMessage("Invalid email"),
				body("password")
					.exists()
					.withMessage("Passwpasswordord missing")
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
					.withMessage("Username is missing")
					.isLength({ min: 4, max: 20 })
					.withMessage("Username must be 8 to 20 characters long")
				];
		}
	}