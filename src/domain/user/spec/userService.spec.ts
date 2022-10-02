import { UserService } from "../user.service"
import {UserDaoMock, UserRepo} from "./mocks/userDao.mock"
import bcrypt from 'bcrypt'

describe('user service', () => {
  let userService: UserService
  let mockUser
  
  beforeAll(() => {
    userService = new UserService(UserDaoMock as any);

    mockUser = {
      password: 'User@123',
      email: 'user@email.com',
      username: 'user'
    }
  })

  it('should create a user with hashed password', async () => {
    UserRepo.create.mockImplementation(async (obj) => {
      return obj
    })
    
    const result = await userService.create(mockUser)
    
    expect(result).toHaveProperty('password_hash')
    expect(bcrypt.compare(mockUser.password, result.password_hash)).toBeTruthy()
    expect(UserRepo.save).toHaveBeenCalled()
  })
})