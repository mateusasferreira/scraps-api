import jwt from 'jsonwebtoken'

function createToken(id: string): string {
	const token = jwt.sign({id}, process.env.JWT_SECRET, {
		expiresIn: '15m'
	})

	return token
}

export default createToken