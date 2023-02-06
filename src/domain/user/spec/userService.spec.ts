import { UserService } from "../user.service"
import bcrypt from 'bcrypt'
import { getUserFixture } from "./fixture"
import { faker } from "@faker-js/faker"
import { UserSearchOptions } from "../interfaces/IUserSearchOptions"

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

jest.mock('bcrypt')
jest.mock('@nestjs/common', () => {
  return {
    Injectable: () => jest.fn(),
    Inject: () => jest.fn()
  }
})

describe('user service', () => {

  it('should return one existing user', async () => {
    const user = getUserFixture();
    const id = '99'

    const userDao = new Object() as any
    userDao.findOne = jest.fn((_id) => {
      return new Promise((resolve) => {
        if(_id === id) {
          resolve(user)
        } else {
          resolve(null)
        }
      })
    })

    const result = await new UserService(userDao).getOne(id)

    expect(result).toEqual(user)
  })
  
  it('should throw NotFoundError if user does not exists', async () => {
    const id = '99'

    const userDao = new Object() as any
    userDao.findOne = jest.fn((_id) => {
      return new Promise((resolve) => {
        if(_id === id) {
          resolve(null)
        } 
      })
    })

    const result = await new UserService(userDao).getOne(id)
      .catch(error => error.name)

    expect(result).toEqual('NotFoundError')
  })

  it('should return a list of users', async () => {
    const users = [
      {userId: '1'},
      {userId: '2'},
    ]
    
    const options: UserSearchOptions = {
      direction: 'ASC',
      limit: 10,
      page: 1
    }
    
    const userDao = new Object() as any
    userDao.find = jest.fn((options) => {
      return new Promise((resolve) => {
        resolve({data: users, total: users.length})
      })
    })

    const result = await new UserService(userDao).getMany(options)

    expect(userDao.find).toBeCalledWith(options)
    expect(result).toEqual({
      data: users,
      total: 2
    })
  })

  it('should delete a user', async () => {
    const id = '99'
    
    const userDao = new Object() as any
    userDao.delete = jest.fn()

    await new UserService(userDao).delete(id)

    expect(userDao.delete).toBeCalledWith(id)
  })

  it('should let users follow each other', async () => {
    const followingId = '99'
    const followerId = '9'

    const userDao = new Object as any
    userDao.checkIsFollowing= jest.fn((_followerId, _followingId) => {
      return new Promise((resolve) => {
        if(_followerId === followerId && _followingId === followingId) {
          resolve(false)
        }
      })
    })
    userDao.follow = jest.fn()

    await new UserService(userDao).follow(followerId, followingId)

    expect(userDao.follow).toBeCalledWith(followerId, followingId)
  })
  
  it('should not let users follow themselves', async () => {
    const followingId = '9'
    const followerId = '9'

    const userDao = new Object as any
    userDao.checkIsFollowing = jest.fn()
    userDao.follow = jest.fn()

    const result = await new UserService(userDao).follow(followerId, followingId)
      .catch(error => error.name)

    expect(result).toEqual('ValidationError')
  })

  it('should not persist any change if users already follow each other', async () => {
    const followingId = '99'
    const followerId = '9'

    const userDao = new Object as any
    userDao.checkIsFollowing= jest.fn((_followerId, _followingId) => {
      return new Promise((resolve) => {
        if(_followerId === followerId && _followingId === followingId) {
          resolve(true)
        }
      })
    })
    userDao.follow = jest.fn()

    await new UserService(userDao).follow(followerId, followingId)

    expect(userDao.follow).toBeCalledTimes(0)
  })
  
  it('should let users unfollow each other', async () => {
    const followingId = '99'
    const followerId = '9'

    const userDao = new Object as any
    userDao.unfollow = jest.fn()

    await new UserService(userDao).unfollow(followerId, followingId)

    expect(userDao.unfollow).toBeCalledWith(followerId, followingId)
  })
 
  it('should create a user with hashed password', async () => {
    const user = getUserFixture();
    const hashedPassword = faker.datatype.string(20)
    
    const userDao = new Object() as any
    userDao.insert = jest.fn()
    userDao.findOne = jest.fn((user) => {
      return new Promise(resolve => {
        resolve(null)
      })
    })

    mockedBcrypt.hash.mockImplementation((password, salt) => {
      if(password = user.password) {
        return hashedPassword
      }
    })

    await new UserService(userDao).create(user)
    
    expect(userDao.insert).toHaveBeenCalledWith({
      email: user.email,
      username: user.username,
      password_hash: hashedPassword
    })
  })
  
  it('should not create a user if password hashing fails', async () => {
    const user = getUserFixture();

    const userDao = new Object() as any
    userDao.insert = jest.fn()
    userDao.findOne = jest.fn((user) => {
      return new Promise(resolve => {
        resolve(null)
      })
    })

    mockedBcrypt.hash.mockImplementation(() => {
      throw new Error('hashingError');
    })

    const result = await new UserService(userDao).create(user)
      .catch(error => error.message)
    
    expect(userDao.insert).toHaveBeenCalledTimes(0)
    expect(result).toEqual('hashingError')
  })
  
  it('should not create a user if password hashing fails', async () => {
    const user = getUserFixture();

    const userDao = new Object() as any
    userDao.insert = jest.fn()
    userDao.findOne = jest.fn((user) => {
      return new Promise(resolve => {
        resolve(null)
      })
    })

    mockedBcrypt.hash.mockImplementation(() => {
      throw new Error('hashingError');
    })

    const result = await new UserService(userDao).create(user)
      .catch(error => error.message)
    
    expect(userDao.insert).toHaveBeenCalledTimes(0)
    expect(result).toEqual('hashingError')
  })
  
  it('should not create user if email is already taken', async () => {
    const _user = getUserFixture();

    const userDao = new Object() as any
    userDao.insert = jest.fn()
    userDao.findOne = jest.fn((user) => {
      return new Promise(resolve => {
        if(user && user.email === _user.email) {
          resolve(_user)
        } else {
          resolve(null)
        }
      })
    })

    const result = await new UserService(userDao).create(_user)
      .catch(error => error.name)
    
    expect(userDao.insert).toHaveBeenCalledTimes(0)
    expect(result).toEqual('ValidationError')
  })
  it('should not create user if email is already taken', async () => {
    const _user = getUserFixture();

    const userDao = new Object() as any
    userDao.insert = jest.fn()
    userDao.findOne = jest.fn((user) => {
      return new Promise(resolve => {
        if(user && user.username === _user.username) {
          resolve(_user)
        } else {
          resolve(null)
        }
      })
    })

    const result = await new UserService(userDao).create(_user)
      .catch(error => error.name)
    
    expect(userDao.insert).toHaveBeenCalledTimes(0)
    expect(result).toEqual('ValidationError')
  })
})