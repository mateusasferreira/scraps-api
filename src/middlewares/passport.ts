import {Strategy, ExtractJwt} from 'passport-jwt'
import { User } from '@models/User'
import { getRepository } from 'typeorm'
import { PassportStatic } from 'passport'


const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET
}

function jwtStrategy (passport: PassportStatic): void {
	passport.use(new Strategy(options, async (payload, done) => {
		try {
			const userRepo = getRepository(User)
    
		  const user = await userRepo.findOne(payload.id)

			if(user){
				return done(null, user)
			}

			return done(null, false)
		} catch (error) {
			done(error, false)
		}
	}))
}

export default jwtStrategy