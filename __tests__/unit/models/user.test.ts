import typeorm from 'typeorm'
import bcrypt from 'bcrypt'

import {User} from '../../../src/models/User'

import UserService from '../../../src/services/UserService'

jest.mock('../../../src/services/EmailService')

describe('User', () => {
	it('should have an encrypted password', async () => {
		(typeorm.getRepository(User).create as jest.Mock).mockImplementation(obj => Promise.resolve(obj))

		const user = await UserService.create({
			username: 'example',
			email: 'example@email.com',
			password: '123'
		}) as any

		expect(bcrypt.compare('123', user.password_hash)).toBeTruthy()
	})
})