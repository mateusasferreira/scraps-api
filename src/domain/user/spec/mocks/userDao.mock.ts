export const UserDaoMock = {
  getRepository(){
    return UserRepo
  }
}

export const UserRepo = {
  create: jest.fn(),
  save: jest.fn()
}
