import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

export default function ensureAuthenticated(req: Request, res: Response, next: NextFunction): void{
	const [,token] = req.headers['authorization'].split(' ')

	jwt.verify(token, process.env.JWT_SECRET, function(err, payload){
		if(err) res.status(401).json({message: err.message})
		req.body.user = payload.user
		next()
	})
}