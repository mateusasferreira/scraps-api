import request, {Response} from 'supertest'
import app from '../../src/app'
import typeorm from 'typeorm'
import {User} from '../../src/models/User'
import jwt from 'jsonwebtoken'

const mockedTypeorm = typeorm as jest.Mocked<typeof typeorm>

jest.mock('../../src/services/emailService')

describe('Registration', () => {
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
			.send({username: 'example', email: 'example@email.com', password: '12341234'})
		
		expect(res.status).toBe(201)
	})

	it('should not create user if username or email was already registered', async () => {
		(mockedTypeorm.getRepository(User).findOne as jest.Mock).mockResolvedValue(true)

		const res: Response = await request(app)
			.post('/users')
			.send({username: 'example', email: 'example2@email.com', password: '12341234'})

		expect(res.status).toBe(400)
	})
  
	it('should be able to confirm email', async () => {
		const user = {
			id: 1
		};

		(mockedTypeorm.getRepository(User).findOne as jest.Mock).mockResolvedValue(user);

		const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
			expiresIn: 60 * 60
		}); 

		const res: Response = await request(app)
			.get(`/confirmation/${token}`);

		expect(res.redirect).toBeTruthy();
	})
})