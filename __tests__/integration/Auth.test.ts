import request, {Request, Response} from 'supertest'
import app from '../../src/app'
import {createConnection, getConnection} from 'typeorm'
import { clearDB } from '../utils/truncate'
import {User} from '../../src/models/User'
import jwt from 'jsonwebtoken'
//import dotenv from 'dotenv'

//dotenv.config()

beforeAll(async () => {
	await createConnection({
		type: 'sqlite',
		database: ':memory:',
		dropSchema: true,
		entities: [User],
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
	it('should provide a valid token when user logs in', async () => {
		await request(app)
			.post('/users')
			.send({username: 'mateus', email: 'mateus@email.com', password: '1234'})


		const res = await request(app)
			.post('/login')
			.send({username: 'mateus', password: '1234'})

		expect(res.body).toHaveProperty('token')
	})
})