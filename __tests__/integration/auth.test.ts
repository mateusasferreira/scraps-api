import request from 'supertest'
import app from '../../src/app'
import {createConnection, getConnection} from 'typeorm'

import {User} from '../../src/models/User'

beforeAll(async () => {
	await createConnection({
		type: 'sqlite',
		database: ':memory:',
		dropSchema: true,
		entities: [User],
		synchronize: true,
	})
})

afterAll(async () => {
	await getConnection().close()
})

describe('Authentication', () => {
	it('should create user', async () => {
		const res = await request(app)
			.post('/users')
			.send({username: 'mateusasd', email: 'matsdadseus@email.com', password: '1sd234'})
      
		expect(res.status).toBe(201)
	})
  
  
})