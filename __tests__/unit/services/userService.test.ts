import typeorm from 'typeorm'
import bcrypt from 'bcrypt'
import {User} from '../../../src/models/User'
import userService from '../../../src/services/userService'

import { RefreshTokens } from '../../../src/models/RefreshTokens'
import jwt from 'jsonwebtoken'

jest.mock('randomstring')
jest.mock('bcrypt')
jest.mock('nodemailer')
jest.mock('jsonwebtoken')

const mockedTypeorm = typeorm as jest.Mocked<typeof typeorm>
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
const mockedJwt = jwt as jest.Mocked<typeof jwt>

beforeAll(() => {
	jest.clearAllMocks()
})

describe('User Service', () => {
	it('should create user', async () => {
		(mockedTypeorm.getRepository(User).findOne as jest.Mock).mockResolvedValue(null);
		(mockedTypeorm.getRepository(User).create as jest.Mock).mockResolvedValue({
			id: 1,
			username: 'example',
			email: 'example@email.com',
			password_hash: '1232313',
			confirmed: false
		});
		
		await userService.create({
			username: 'example',
			email: 'example@email.com',
			password: '1234'
		})

		expect(mockedBcrypt.hash).toBeCalledWith('1234', 8)

	})

	it('should provide a new token if refresh token is valid', async () => {
		(mockedTypeorm.getRepository(User).findOne as jest.Mock).mockResolvedValue({user: 'user'});
		(mockedTypeorm.getRepository(RefreshTokens).findOne as jest.Mock).mockResolvedValue({token: 'token', user: 'user'});

		await userService.validateRefreshToken('token');

		expect(mockedTypeorm.getRepository(RefreshTokens).findOne).toBeCalledWith('token');
		expect(mockedTypeorm.getRepository(User).findOne).toBeCalledWith('user');
		expect(mockedJwt.sign).toBeCalledTimes(1);
	})

	it('should invalidate refresh token when logging out', async () => {
		await userService.logout('token');

		expect(mockedTypeorm.getRepository(RefreshTokens).delete).toBeCalledTimes(1)
		expect(mockedTypeorm.getRepository(RefreshTokens).delete).toBeCalledWith('token')
	})


	it('should change password if requested', async () => {
		
		
		const user = {
			id: 1,
			username: 'example',
			email: 'example@email.com',
			password_hash: '1231231',
			confirmed: true
		};

		(mockedTypeorm.getRepository(User).findOne as jest.Mock).mockResolvedValue(user);
		(mockedBcrypt.compare as jest.Mock).mockResolvedValue(true)
		
		await userService.changePassword(user.id, '1234', '12345');

		//expect(mockedTypeorm.getRepository(User).findOne).toBeCalledWith(user.id);
		expect(bcrypt.compare).toBeCalledWith('1234', '1231231');
		expect(bcrypt.hash).toBeCalledWith('12345', 8);
		expect(mockedTypeorm.getRepository(User).update).toBeCalledTimes(1)
		expect(mockedTypeorm.getRepository(RefreshTokens).delete).toBeCalledWith({user: user.id})
	})

	it('should delete user', async () => {
		await userService.delete(99)

		expect(mockedTypeorm.getRepository(RefreshTokens).delete).toBeCalledWith(99)

	})
})

