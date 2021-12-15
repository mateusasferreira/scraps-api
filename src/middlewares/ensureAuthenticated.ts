import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function ensureAuthenticated(req: Request, res: Response, next: NextFunction){
	try {
		if(!req.headers['authorization']) return res.status(403).json({errors: [{message: 'Missing authentication token'}]})
	
	  const [,token] = req.headers['authorization'].split(' ')

		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		req.body.user = (<any>decoded).payload.id

		next()
	} catch (e) {
		res.status(401).json({errors: [{message: e.message}]})
	}
}