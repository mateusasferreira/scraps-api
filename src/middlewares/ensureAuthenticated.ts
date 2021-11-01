import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

export default function ensureAuthenticated(req: Request, res: Response, next: NextFunction): void{
	const [,token] = req.headers['authorization'].split(' ')

	jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){
		if(err) res.status(401).json({message: err.message})
		console.log(decoded)

		req.body.user = decoded.payload.id
		next()
	})
}