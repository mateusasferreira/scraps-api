import typeorm from 'typeorm'
import { Follow } from '../../../src/models/Follow'
import followService from '../../../src/services/followService'

const mockedTypeorm = typeorm as jest.Mocked<typeof typeorm>

describe("follow service", () => {
  it("should not allow user to follow itself", async () => {
    
    
    const follower = {
      id: '1'
    }

    const followingId = '1'

    expect(() => followService.follow(follower, followingId)).rejects.toThrow()
  })

  it("should allow user to follow another user", async () => {
    (mockedTypeorm.getRepository(Follow).findOne as jest.Mock).mockReturnValue(true)

    const follower = {
      id: '1'
    };

    const followingId = '2';

    await followService.follow(follower, followingId)

    expect(mockedTypeorm.getRepository(Follow).create).toBeCalled()
    expect(mockedTypeorm.getRepository(Follow).save).toBeCalled()
  })
})