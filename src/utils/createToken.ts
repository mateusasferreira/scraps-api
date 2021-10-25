import jwt from 'jsonwebtoken'

export function createToken(payload: unknown): string {
	const token = jwt.sign({payload}, process.env.JWT_SECRET, {
		expiresIn: '30s'
	})

	return token
}