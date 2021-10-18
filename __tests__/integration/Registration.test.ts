import request, {Request, Response} from 'supertest'
import app from '../../src/app'
import {createConnection, getConnection} from 'typeorm'
import { clearDB } from '../utils/truncate'
import {User} from '../../src/models/User'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

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

describe('Registration', () => {
	it('should create user', async () => {
		const res: Response = await request(app)
			.post('/users')
			.send({username: 'mateus', email: 'mateus@email.com', password: '1234'})
      
		expect(res.status).toBe(201)
	})

	it('should not create user if username was already registered', async () => {
		await request(app)
			.post('/users')
			.send({username: 'mateus', email: 'mateus@email.com', password: '1234'})

		const res: Response = await request(app)
			.post('/users')
			.send({username: 'mateus', email: 'mateus2@email.com', password: '1234'})

		expect(res.status).toBe(401)
	})
  
	it('should not create user if email was already registered', async () => {
		await request(app)
			.post('/users')
			.send({username: 'mateus', email: 'mateus@email.com', password: '1234'})

		const res: Response = await request(app)
			.post('/users')
			.send({username: 'mateuss', email: 'mateus@email.com', password: '1234'})

		expect(res.status).toBe(401)
	})

	it('should be able to confirm email', async () => {
		await request(app)
			.post('/users')
			.send({username: 'mateus', email: 'mateus@email.com', password: '1234'})

		const user = await getConnection().getRepository(User).findOne({where: { username: 'mateus'}})

		const token = jwt.sign(user.id, process.env.JWT_SECRET)

		const res: Response = await request(app)
			.get(`/confirmation/${token}`)

		expect(res.status).toBe(200)
		
	})
})