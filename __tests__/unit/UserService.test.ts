/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable @typescript-eslint/no-empty-function */
import typeorm, {Repository} from 'typeorm'
import {mock} from 'jest-mock-extended'
import bcrypt from 'bcrypt'
import {User} from '../../src/models/User'
import UserService from '../../src/services/UserService'
import EmailService from '../../src/services/EmailService'

import randomString from 'randomstring'

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

jest.mock('../../src/services/EmailService')
jest.mock('randomstring')
jest.mock('bcrypt')
jest.mock('nodemailer')

const mockedEmailService = EmailService as jest.Mocked<typeof EmailService>
const mockedRandomString = randomString as jest.Mocked<typeof randomString>
const mockedTypeorm = typeorm as jest.Mocked<typeof typeorm>
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>


describe('User Service', () => {
	it('should recover password',  async () => {
		(mockedTypeorm.getRepository(User).findOne as jest.Mock).mockImplementation(obj => { return {confirmed: true}} )
    
		await UserService.recoverPassword('myemail')
  
		expect(mockedTypeorm.getRepository(User).findOne).toBeCalledTimes(1)
		expect(mockedRandomString.generate).toBeCalledTimes(1)
		expect(mockedBcrypt.hash).toBeCalledTimes(1)
		expect(mockedTypeorm.getRepository(User).update).toBeCalledTimes(1)
		expect(mockedEmailService.sendRecoverPassword).toBeCalledTimes(1)
	})
})

