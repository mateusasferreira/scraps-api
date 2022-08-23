import { body, param } from "express-validator";

export default function validate(method: string) {
	switch (method) {
		case "login":
			return [
				body("password").exists().withMessage("password missing"),
				body("user").exists().withMessage("user missing"),
			];
		case "change-password":
			return [
				body("oldPassword")
					.exists()
					.withMessage("current password missing"),
				body("newPassword")
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
			];
		case "confirm-email":
			return [param("id").exists().withMessage("id is missing")];
		case "refresh-token":
			return [body("token").exists().withMessage("token is missing")];
	}
}
