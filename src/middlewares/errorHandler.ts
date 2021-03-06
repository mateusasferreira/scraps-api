import { Request, Response } from 'express'
import { HttpException } from '../utils/httpException'

export default function errorHandler(err: Error, req: Request, res: Response): void{
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