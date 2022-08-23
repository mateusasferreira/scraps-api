import { Profile } from '@models/Profile'
import S3Service from '@services/s3'
import {getRepository} from 'typeorm'

class ProfileService {
	async getMyProfile(user): Promise<Profile> {
		const profileRepo = getRepository(Profile)

		const profile = await profileRepo.findOne({user})

		console.log(profile)

		return profile
	}

	async create(options): Promise<Profile>{
		const profileRepo = getRepository(Profile)
		
		const resultFile = await S3Service.uploadFile(options.file) 

		const newProfile = await profileRepo.create({
			user: options.user,
			name: options.name,
			bio: options.bio,
			picture: resultFile,
			birth_date: options.birth_date,
			location: options.location,
		})
		
		await profileRepo.save(newProfile)

		return newProfile
	}

	async update(options): Promise<Profile>{
		const profileRepo = getRepository(Profile)

		const fk = options.user.id

		delete options.user

		if(options.file){
			const resultFile = await S3Service.uploadFile(options.file) 

			Object.assign(options, {picture: resultFile})
		}
		
		delete options.file

		await profileRepo.update({userId: fk}, options)

		const updatedProfile = profileRepo.findOne({userId: fk})

		return updatedProfile
	}
}

export default new ProfileService()