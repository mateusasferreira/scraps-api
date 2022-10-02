export const UserDaoMock = {
  get(){
    return UserRepo
  }
}

export const UserRepo = {
  create: jest.fn(),
  save: jest.fn()
}
