import request from 'supertest'
import app from '../../src/app'
import {User} from '../../src/models/User'
import {RefreshTokens} from '../../src/models/RefreshTokens'
import bcrypt from 'bcrypt'
import typeorm from 'typeorm'

const mockedTypeorm = typeorm as jest.Mocked<typeof typeorm>

beforeAll(() => {
	jest.clearAllMocks()
})

describe('Authentication', () => {
	it('should provide a valid token and refresh Token when user logs in', async () => {
		
		const password = await bcrypt.hash('12341234', 8);
		
		(mockedTypeorm.getRepository(User).findOne as jest.Mock).mockResolvedValue({
			username: 'example',
			email: 'example@email.com',
			password_hash: password,
			confirmed: true,		
		});

		(mockedTypeorm.getRepository(RefreshTokens).create as jest.Mock).mockResolvedValue({
			token: '1'
		});

		const res = await request(app)
			.post('/auth/login')
			.send({username: 'mateus', password: '12341234'});
		
		expect(res.body).toHaveProperty('accessToken');
		expect(res.body).toHaveProperty('refreshToken');
	})
	
	it('should not provide a token if credentials are invalid', async () => {
		const password = await bcrypt.hash('12341234', 8);
		
		(mockedTypeorm.getRepository(User).findOne as jest.Mock).mockResolvedValue({
			username: 'example',
			email: 'example@email.com',
			password_hash: password,
			confirmed: true,		
		});

		(mockedTypeorm.getRepository(RefreshTokens).create as jest.Mock).mockResolvedValue({
			token: '1'
		});

		const res = await request(app)
			.post('/auth/login')
			.send({username: 'mateus', password: '123412345'});
		
		expect(res.status).toBe(401);
	})
})
