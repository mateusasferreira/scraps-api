import { body } from "express-validator";
import { getRepository } from "typeorm";
import { User } from "../../models/User";

function validate(method) {
	switch (method) {
		case "create-user":
			return [
				body("email")
					.exists()
					.withMessage("email missing")
					.isEmail()
					.withMessage("email is not valid")
					.custom(async (email) => {
						const userRepo = getRepository(User);

						const emailIsTaken = await userRepo.findOne({
							where: { email },
						});

						if (emailIsTaken)
							throw new Error("email is already taken");

						return true;
					}),
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
					.custom(async (username) => {
						const userRepo = getRepository(User);

						const usernameIsTaken = await userRepo.findOne({
							where: { username },
						});

						if (usernameIsTaken)
							throw new Error("username is already taken");

						return true;
					}),
			];
	}
}

export default validate