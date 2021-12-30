import ProfileService from '../../src/services/ProfileService'
import S3Service from '../../src/services/external/s3'
import typeorm from 'typeorm'
import { Profile } from '../../src/models/Profile'
jest.mock('../../src/services/external/s3')

const mockedS3Service = S3Service as jest.Mocked<typeof S3Service>
const mockedTypeorm = typeorm as jest.Mocked<typeof typeorm>

describe('Profile Service', () => {
  it('should create new profile', async () => {
    
    const options = {
      file: 'file',
      name: 'name',
      bio: 'bio',
      birthDate: 'birthdate',
      location: 'location'
    }
    
    await ProfileService.create(options)

    expect(mockedS3Service.uploadFile).toBeCalledTimes(1)
    expect(mockedS3Service.uploadFile).toBeCalledWith(options.file);
    expect(mockedTypeorm.getRepository(Profile).create).toBeCalledTimes(1)
    expect(mockedTypeorm.getRepository(Profile).save).toBeCalledTimes(1)
  })

  it('should return a profile', async () => {
    const param = 1;
    
    (mockedTypeorm.getRepository(Profile).findOne as jest.Mock).mockResolvedValue({picture: '123'});

    await ProfileService.get(param);

    expect(mockedTypeorm.getRepository(Profile).findOne).toBeCalledWith(param)
  })

  it('should update profile', async () => {
    const options = {
      file: 'file',
      name: 'name',
      bio: 'bio',
      birthDate: 'birthdate',
      location: 'location',
      user: {id: '1'}
    }
    
    await ProfileService.update(options)

    expect(mockedS3Service.uploadFile).toBeCalledTimes(1)
    expect(mockedS3Service.uploadFile).toBeCalledWith("file");
    expect(mockedTypeorm.getRepository(Profile).update).toBeCalledTimes(1)
  })
})