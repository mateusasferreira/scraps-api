import request from 'supertest'
import app from '../../src/app'
import {createConnection, getConnection} from 'typeorm'
import { clearDB } from '../utils/truncate'
import {User} from '../../src/models/User'
import {RefreshTokens} from '../../src/models/RefreshTokens'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

beforeAll(async () => {
	await createConnection({
		type: 'sqlite',
		database: ':memory:',
		dropSchema: true,
		entities: [User, RefreshTokens],
		synchronize: true,
	})
})

afterEach(async () => {
	await clearDB()
})

afterAll(async () => {
	await getConnection().close()
})

describe('Authentication', () => {
	it('should provide a valid token and refresh Token when user logs in', async () => {
		await request(app)
			.post('/users')
			.send({username: 'mateus', email: 'mateus@email.com', password: '1234'})

		await getConnection().getRepository(User).update({username: 'mateus'}, {confirmed: true})


		const res = await request(app)
			.post('/login')
			.send({username: 'mateus', password: '1234'})
		
		expect(res.body).toHaveProperty('accessToken')
		expect(res.body).toHaveProperty('refreshToken')
	})
	
	it('should not provide a token if credentials are invalid', async () => {
		await request(app)
			.post('/users')
			.send({username: 'mateus', email: 'mateus@email.com', password: '1234'})

		
		await getConnection().getRepository(User).update({username: 'mateus'}, {confirmed: true})


		const res = await request(app)
			.post('/login')
			.send({username: 'mateus', password: '123456'})

		expect(res.status).toBe(401)
	})

	it('should provide a new token if refresh token is valid', async () => {
		const user = await getConnection().getRepository(User).create({
			username: 'exemplo',
			email: 'exemplo@email.com',
			password_hash: '1234'
		})
		
		await getConnection().getRepository(User).save(user)

		const rToken = await getConnection().getRepository(RefreshTokens).create({
			user: user
		})

		await getConnection().getRepository(RefreshTokens).save(rToken)

		const res = await request(app)
			.post('/token')
			.send({token: rToken.token})
		
		const {payload} = jwt.verify(res.body.accessToken, process.env.JWT_SECRET) as TokenPayload

		expect(payload.id).toEqual(user.id)
	})

	it('should invalidate refresh token when logging out', async () => {
		const user = await getConnection().getRepository(User).create({
			username: 'exemplo',
			email: 'exemplo@email.com',
			password_hash: '1234'
		})
		
		await getConnection().getRepository(User).save(user)

		const rToken = await getConnection().getRepository(RefreshTokens).create({
			user: user
		})

		await getConnection().getRepository(RefreshTokens).save(rToken)

		await request(app)
			.delete('/logout')
			.send({refreshToken: rToken.token})

		expect((await request(app).post('/token').send({token: rToken.token})).status).toBe(401)
	})
})

interface TokenPayload extends JwtPayload {
	payload: any
}