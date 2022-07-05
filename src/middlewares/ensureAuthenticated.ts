/* eslint-disable @typescript-eslint/no-explicit-any */
import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import { HttpException } from '../utils/httpException'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function ensureAuthenticated(req: Request, res: Response, next: NextFunction){
	if(!req.headers['authorization']) return res.status(401).json({errors: [{message: 'Missing authentication token'}]})
	
	const [,token] = req.headers['authorization'].split(' ')

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded: any) => {
		if (err) throw new HttpException(401, 'Invalid Token')
		
		req.user = decoded.payload 
		
		next()
	}) as any
}