import { Profile } from '@models/Profile'
import S3Service from '@services/external/s3'
import {getRepository} from 'typeorm'

class ProfileService {
	async create(options){
		const profileRepo = getRepository(Profile)
		
		const resultFile = await S3Service.uploadFile(options.file) 

		const newProfile = await profileRepo.create({
			id: options.user,
			name: options.name,
			bio: options.bio,
			picture: resultFile,
			birth_date: options.birth_date,
			location: options.location,
		})
		
		await profileRepo.save(newProfile)
	}
}

export default new ProfileService()