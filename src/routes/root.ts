import { Router } from 'express'

const root = Router()

root.get('/', (req, res) => {
	res.status(200).json({message: 'Hello World'})
})

export default root