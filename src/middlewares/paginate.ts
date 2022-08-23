import { NextFunction, Request, Response } from 'express'

function paginate(req: Request, res: Response, next: NextFunction): void {
	const limit: number = parseInt(req.query.limit as string) || 10
	const page: number = parseInt(req.query.page as string) || 1

	const skip: number = (page - 1) * limit

	req.body.limit = limit
	req.body.skip = skip
  
	next()
}

export default paginate