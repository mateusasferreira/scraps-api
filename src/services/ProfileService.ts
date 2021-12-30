import { Profile } from '@models/Profile'
import S3Service from '@services/external/s3'
import {getRepository} from 'typeorm'

class ProfileService {
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

	async get(id): Promise<Profile>{
		const profileRepo = getRepository(Profile)

		let profile = await profileRepo.findOne(id)

		if(!profile) throw new Error('Profile doesn\'t exists')
		

		const parsedPicture = `/images/${profile.picture}`

		profile = {...profile, picture: parsedPicture}
		
		return profile
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