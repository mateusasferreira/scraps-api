import typeorm from 'typeorm'
import { Like } from '../../../src/models/Like'
import { Scrap } from '../../../src/models/Scrap'
import { User } from '../../../src/models/User'
import LikesService from '../../../src/services/LikeService'

import LikeService from '../../../src/services/LikeService'

const mockedTypeorm = typeorm as jest.Mocked<typeof typeorm>


describe('likes service', () => {
  it('should like a scrap', async () => {
    const user = {
      id: '1'
    };

    const scrap = {
      id: '1'
    };

    (mockedTypeorm.getRepository(Like).findOne as jest.Mock).mockResolvedValueOnce(user);
    (mockedTypeorm.getRepository(Like).findOne as jest.Mock).mockResolvedValueOnce(scrap);

    await LikesService.like(scrap.id, user.id);

    expect(mockedTypeorm.getRepository(User).findOne).toBeCalledWith(user.id)
    expect(mockedTypeorm.getRepository(Scrap).findOne).toBeCalledWith(scrap.id)
    expect(mockedTypeorm.getRepository(Like).create).toBeCalledTimes(1)
    expect(mockedTypeorm.getRepository(Like).save).toBeCalledTimes(1)
  })

  it('should dislike a post', async () => {
    await LikeService.dislike('1');

    expect(mockedTypeorm.getRepository(Like).delete).toBeCalledTimes(1)
  })
})