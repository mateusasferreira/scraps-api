import express, {Express} from 'express'
import dotenv from 'dotenv'

import userRoutes from '@routes/userRoutes'
import authRoutes from '@routes/authRoutes'
import profileRoutes from '@routes/profileRoutes'
import scrapsRoutes from '@routes/scrapsRoutes'

dotenv.config()

class App {

	public express: Express

	constructor(){
		this.express = express()
		this.middlewares()
		this.routes()
	}

	middlewares(){
		this.express.use(express.json())
	}

	routes(){
		this.express.use('/users', userRoutes)
		this.express.use('/auth', authRoutes)
		this.express.use('/profile', profileRoutes)
		this.express.use('/scraps', scrapsRoutes)
	}
}

export default new App().express