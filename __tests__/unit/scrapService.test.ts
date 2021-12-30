import ScrapService from '../../src/services/ScrapsService'
import typeorm from 'typeorm'
import { Scrap } from '../../src/models/Scrap'

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
})