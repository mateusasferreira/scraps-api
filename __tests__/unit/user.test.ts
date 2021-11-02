import request from 'supertest'
import app from '../../src/app'
import {createConnection, getConnection} from 'typeorm'
import { clearDB } from '../utils/truncate'
import {User} from '../../src/models/User'
import {RefreshTokens} from '../../src/models/RefreshTokens'
import bcrypt from 'bcrypt'

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

describe('User', () => {
	it('should have an encrypted password', async () => {
		await request(app)
			.post('/users')
			.send({username: 'mateus', email: 'mateus@email.com', password: '1234'})

		const user = await getConnection().getRepository(User).findOne({where: { username: 'mateus'}})

		expect(await bcrypt.compare('1234', user.password_hash)).toBe(true)
	})
})