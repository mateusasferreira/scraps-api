import jwt from 'jsonwebtoken'

export function createToken(payload: unknown): string {
	const token = jwt.sign({payload}, process.env.JWT_SECRET, {
		expiresIn: '15m'
	})

	return token
}