/* eslint-disable @typescript-eslint/no-explicit-any */
import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm';
import { User } from '@models/User';
import { HttpException } from '../utils/httpException'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function authenticate(req: Request, res: Response, next: NextFunction){
	try {
		if(!req.headers['authorization']) throw new HttpException(401, 'Missing authentication token');
	
		const [,token] = req.headers['authorization'].split(' ')

		var decoded: any = jwt.verify(token, token);

		const userRepo = getRepository(User)

		const user = await userRepo.findOne(decoded.id)

		if(!user) throw new HttpException(401, 'Invalid Token')

		req.user = user

		next()
		
	} catch (e) {
		if(e instanceof HttpException) {
			next(e)
		} else {
			res.sendStatus(401)
		}
	}
}

export default authenticate