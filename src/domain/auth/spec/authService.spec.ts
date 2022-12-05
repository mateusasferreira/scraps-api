import { AuthService } from '../auth.service'
import bcrypt from 'bcrypt'
import { getLoginPayloadFixture, getUserFixture } from './fixtures'
import createToken from '../../../utils/createToken'
import { faker } from '@faker-js/faker'

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
const mockedCreateToken = createToken as jest.Mocked<any>

jest.mock('bcrypt')
jest.mock('../../../utils/createToken')

describe('auth service', () => {
	test('user login successfully', async () => {
		const payload = getLoginPayloadFixture()
		const user = getUserFixture()
		const dataSource = new Object as any
		const accessToken = faker.datatype.string()
		const refreshToken = new Object() as any
		refreshToken.token = faker.datatype.string()
		const mockSaveRefreshToken = jest.fn()

		dataSource.getRepository = jest.fn(function(model){
			if(model.name === 'User') {
				this.createQueryBuilder = jest.fn(function(tableName){
					this.where= jest.fn(function(field, value){
						if(field === 'user.email = :email' && value.email === payload.user) {
							this.orWhere = jest.fn(function(field, value){
								if(field === 'user.username = :username' && value.username === payload.user){
									this.getOne = jest.fn(() => {
										return user
									})
								}
								return this
							})
						}
						return this
					})
					return this
				})
			}

			if(model.name === 'RefreshToken') {
				this.create = jest.fn(function(payload) {
					if(payload.user === user) {
						return refreshToken
					}
				})
				this.save = mockSaveRefreshToken
				return this
			}

			return this
		})

		mockedBcrypt.compare.mockImplementation((password, encrypted) => {
			if(password === payload.password && encrypted === user.password_hash) {
				return true
			}
		})
		mockedCreateToken.mockImplementation((id) => {
			if(id === user.id) {
				return accessToken
			}
		})

		const authService = new AuthService(dataSource)

		const res = await authService.login(payload)

		expect(res).toHaveProperty('accessToken')
		expect(res.accessToken).toEqual(accessToken)
		expect(res).toHaveProperty('refreshToken')
		expect(res.refreshToken).toEqual(refreshToken.token)
		expect(mockSaveRefreshToken).toHaveBeenCalledWith(refreshToken)
	})
	
	test('user login with no user found error', async () => {
		const payload = getLoginPayloadFixture()
		const dataSource = new Object as any

		dataSource.getRepository = jest.fn(function(model){
			if(model.name === 'User') {
				this.createQueryBuilder = jest.fn(function(tableName){
					this.where= jest.fn(function(field, value){
						if(field === 'user.email = :email' && value.email === payload.user) {
							this.orWhere = jest.fn(function(field, value){
								if(field === 'user.username = :username' && value.username === payload.user){
									this.getOne = jest.fn(() => {
										return null
									})
								}
								return this
							})
						}
						return this
					})
					return this
				})
			}

			return this
		})

		const authService = new AuthService(dataSource)

		await authService.login(payload)
			.catch(error => {
				expect(error.status).toEqual(401)
			})
	})

	test('user login successfully', async () => {
		const payload = getLoginPayloadFixture()
		const user = getUserFixture()
		const dataSource = new Object as any

		dataSource.getRepository = jest.fn(function(model){
			if(model.name === 'User') {
				this.createQueryBuilder = jest.fn(function(tableName){
					this.where= jest.fn(function(field, value){
						if(field === 'user.email = :email' && value.email === payload.user) {
							this.orWhere = jest.fn(function(field, value){
								if(field === 'user.username = :username' && value.username === payload.user){
									this.getOne = jest.fn(() => {
										return user
									})
								}
								return this
							})
						}
						return this
					})
					return this
				})
			}

			return this
		})

		mockedBcrypt.compare.mockImplementation((password, encrypted) => {
			if(password === payload.password && encrypted === user.password_hash) {
				return false
			}
		})

		const authService = new AuthService(dataSource)

		await authService.login(payload)
			.catch(error => {
				expect(error.status).toEqual(401)
			})
	})
	
})