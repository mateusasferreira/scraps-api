import { NextFunction, Request, Response } from 'express'
import { HttpException } from '../utils/httpException'

export default function errorHandler(err: any, req: Request, res: Response, _): void{
	let statusCode = 500 
	let message = 'Internal Server Error'
  
	if (err instanceof HttpException){
		statusCode = err.status
		message = err.message
	} else {
		console.error(err)
	}

	res.status(statusCode).json({
		errors: [
			{message}
		]
	})
}