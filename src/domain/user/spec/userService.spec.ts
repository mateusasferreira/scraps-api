import { UserService } from "../user.service"
import bcrypt from 'bcrypt'
import { User } from "../../../models/User"
import { DataSource } from "typeorm"

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

jest.mock('bcrypt')

describe('user service', () => {
 
  it('should create a user with hashed password', async () => {
    const mockUser = {
      password: 'User@123',
      email: 'user@email.com',
      username: 'user'
    }
    
    const mockCreate = jest.fn((payload) => {
      return {...payload, id: '123'}
    })
    const mockSave = jest.fn()
    
    const dataSource = new Object() as any
    dataSource.getRepository = jest.fn(function(model) {
      if(model.name === 'User') {
        this.create = mockCreate
        this.save = mockSave
      }

      return this
    })
    mockedBcrypt.hash.mockImplementation((password, salt) => {
      if(password = 'User@123') {
        return 'hashed_User@123'
      }
    })

    const service = new UserService(dataSource)
    
    await service.create(mockUser)
    
    expect(mockSave).toHaveBeenCalledWith({
      id: '123',
      email: 'user@email.com',
      username: 'user',
      password_hash: 'hashed_User@123'
    })
  })
  
  it('should not create a user if password hashing fails', async () => {
    const mockUser = {
      password: 'User@123',
      email: 'user@email.com',
      username: 'user'
    }
    
    const mockCreate = jest.fn((payload) => {
      return {...payload, id: '123'}
    })
    const mockSave = jest.fn()
    
    const dataSource = new Object() as any
    dataSource.getRepository = jest.fn(function(model) {
      if(model.name === 'User') {
        this.create = mockCreate
        this.save = mockSave
      }

      return this
    })
    mockedBcrypt.hash.mockImplementation(() => {
      throw new Error('hashingError');
    })

    const service = new UserService(dataSource)
    
    const result = await service.create(mockUser)
      .catch(err => err.message)
    
    expect(mockCreate).toHaveBeenCalledTimes(0)
    expect(mockSave).toHaveBeenCalledTimes(0)
    expect(result).toEqual('hashingError')
  })
})