import request, {Response} from 'supertest'
import app from '../../src/app'
import typeorm from 'typeorm'
import {User} from '../../src/models/User'
import jwt from 'jsonwebtoken'

const mockedTypeorm = typeorm as jest.Mocked<typeof typeorm>

describe('Registration', () => {
	let body

	beforeAll(() => {
		body = {username: 'example', email: 'example@email.com', password: 'Password123'}
	})
	
	it('should create user', async () => {
		(mockedTypeorm.getRepository(User).create as jest.Mock).mockResolvedValue({
			id: 1,
			username: 'example',
			email: 'example@email.com',
			password_hash: '1232313',
			confirmed: false
		});
		
		const res = await request(app)
			.post('/users')
			.send(body)
		console.log(res.body)
		expect(res.status).toBe(201)
	})

	it('should not create user if username or email was already registered', async () => {
		(mockedTypeorm.getRepository(User).findOne as jest.Mock).mockResolvedValue(true)

		const res: Response = await request(app)
			.post('/users')
			.send(body)

		expect(res.status).toBe(400)
	})
	
	it('should not create user if password is not at least 8 caracters long, one uppercase and one number', async () => {
		body = {...body, password: '1234'};
		
		(mockedTypeorm.getRepository(User).findOne as jest.Mock).mockResolvedValue(true)

		const res: Response = await request(app)
			.post('/users')
			.send(body)

		expect(res.status).toBe(400)
	})
})