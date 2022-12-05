import { UserService } from "../user.service"
import bcrypt from 'bcrypt'
import { getUserFixture } from "./fixture"
import { faker } from "@faker-js/faker"

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

jest.mock('bcrypt')

describe('user service', () => {
 
  it('should create a user with hashed password', async () => {
    const user = getUserFixture();
    const hashedPassword = faker.datatype.string()
    const userId =  faker.datatype.uuid()

    const mockCreate = jest.fn((payload) => {
      return {...payload, id: userId}
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
      if(password = user.password) {
        return hashedPassword
      }
    })

    const service = new UserService(dataSource)
    
    await service.create(user)
    
    expect(mockSave).toHaveBeenCalledWith({
      id: userId,
      email: user.email,
      username: user.username,
      password_hash: hashedPassword
    })
  })
  
  it('should not create a user if password hashing fails', async () => {
    const user = getUserFixture();
    const userId =  faker.datatype.uuid()

    const mockCreate = jest.fn((payload) => {
      return {...payload, id: userId}
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
    
    const result = await service.create(user)
      .catch(err => err.message)
    
    expect(mockCreate).toHaveBeenCalledTimes(0)
    expect(mockSave).toHaveBeenCalledTimes(0)
    expect(result).toEqual('hashingError')
  })
})