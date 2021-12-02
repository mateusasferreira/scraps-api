import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function ensureAuthenticated(req: Request, res: Response, next: NextFunction){
	
	if(!req.headers['authorization']) return res.status(403).json({message: 'Missing authentication token'})
	
	const [,token] = req.headers['authorization'].split(' ')

	jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){
		if(err) return res.status(401).json({message: err.message})
		req.body.user = decoded.payload.id
		next()
	})
}