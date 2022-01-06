import ScrapService from '../../src/services/ScrapsService'
import typeorm from 'typeorm'
import { Scrap } from '../../src/models/Scrap'
import { User } from '../../src/models/User'

const mockedTypeorm = typeorm as jest.Mocked<typeof typeorm>


describe('scraps service', () => {
  it('should create scrap', async () => {
    (mockedTypeorm.getRepository(Scrap).create as jest.Mock).mockImplementation(obj => obj)

    const options = {
      content: 'any',
      senderId: '1',
      receiverId: '2'
    }
    
    await ScrapService.create(options)
    expect(mockedTypeorm.getRepository(Scrap).create).toBeCalledTimes(1)
    expect(mockedTypeorm.getRepository(Scrap).save).toBeCalledTimes(1)
  })

  it('should update scrap if caller is the creator', async () => {
    const oldScrap = {
      id: '1',
      content: 'old content',
      senderId: '1',
      receiverId: '2',
      date: '2022-01-03'
    };
    
    const newScrap = {
      id: '1',
      content: 'new content',
      senderId: '1',
      receiverId: '2',
      date: '2022-01-03'
    };

    const user = {
      id: '1'
    };
    
    (mockedTypeorm.getRepository(Scrap).findOne as jest.Mock)
      .mockResolvedValueOnce(oldScrap)
      .mockResolvedValueOnce(newScrap)
    
    const returnedValue = await ScrapService.update(oldScrap.id, 'content', user)

    expect(mockedTypeorm.getRepository(Scrap).findOne).toHaveBeenCalledTimes(2)
    expect(mockedTypeorm.getRepository(Scrap).update).toHaveBeenCalledTimes(1)
    expect(returnedValue).toEqual(newScrap)
  })

  it('should not update scrap is caller is not the creator', async () => {
    const oldScrap = {
      id: '1',
      content: 'old content',
      senderId: '1',
      receiverId: '2',
      date: '2022-01-03'
    };
    
    const newScrap = {
      id: '1',
      content: 'new content',
      senderId: '1',
      receiverId: '2',
      date: '2022-01-03'
    };
    
    const user = {
      id: '2'
    };

    (mockedTypeorm.getRepository(Scrap).findOne as jest.Mock)
      .mockResolvedValueOnce(oldScrap)
      .mockResolvedValueOnce(newScrap);

    expect(() => ScrapService.update(oldScrap.id, 'content', user)).rejects.toThrow();
  })

  it('should delete scrap if caller is the creator', async () => {
    const user = {
      id: '1'
    }

    const scrap = {
      id: '1',
      content: 'new content',
      senderId: '1',
      receiverId: '2',
      date: '2022-01-03'
    };

    (mockedTypeorm.getRepository(Scrap).findOne as jest.Mock)
      .mockResolvedValue(scrap)

    await ScrapService.delete(scrap.id, user)

    expect(mockedTypeorm.getRepository(Scrap).findOne).toBeCalledTimes(1)
    expect(mockedTypeorm.getRepository(Scrap).delete).toBeCalledTimes(1)
    expect(mockedTypeorm.getRepository(Scrap).delete).toBeCalledWith(scrap.id)
  })
  
  it('should delete scrap if caller is the receiver', async () => {
    const user = {
      id: '2'
    }

    const scrap = {
      id: '1',
      content: 'new content',
      senderId: '1',
      receiverId: '2',
      date: '2022-01-03'
    };

    (mockedTypeorm.getRepository(Scrap).findOne as jest.Mock)
      .mockResolvedValue(scrap)

    await ScrapService.delete(scrap.id, user)

    expect(mockedTypeorm.getRepository(Scrap).findOne).toBeCalledTimes(1)
    expect(mockedTypeorm.getRepository(Scrap).delete).toBeCalledTimes(1)
    expect(mockedTypeorm.getRepository(Scrap).delete).toBeCalledWith(scrap.id)
  })
  
  it('should not delete scrap if caller is not creator nor receiver', async () => {
    const user = {
      id: '3'
    }

    const scrap = {
      id: '1',
      content: 'new content',
      senderId: '1',
      receiverId: '2',
      date: '2022-01-03'
    };

    (mockedTypeorm.getRepository(Scrap).findOne as jest.Mock)
      .mockResolvedValue(scrap)

    expect(() => ScrapService.delete(scrap.id, user)).rejects.toThrow()
  })
})