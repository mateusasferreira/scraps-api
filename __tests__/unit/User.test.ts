/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable @typescript-eslint/no-empty-function */
import typeorm, {Repository} from 'typeorm'
import bcrypt from 'bcrypt'
import {mock} from 'jest-mock-extended'

import {User} from '../../src/models/User'

import UserService from '../../src/services/UserService'


const repositoryMock = mock<Repository<any>>()

jest.mock('typeorm', () => {
	
	return {
		getRepository: () => repositoryMock,

		BaseEntity: class Mock {},
		ObjectType: () => {},
		Entity: () => {},
		InputType: () => {},
		Index: () => {},
		PrimaryGeneratedColumn: () => {},
		Column: () => {},
		CreateDateColumn: () => {},
		UpdateDateColumn: () => {},
		OneToMany: () => {},
		ManyToOne: () => {},
	}
})



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