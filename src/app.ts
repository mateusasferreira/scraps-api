import express from 'express'
import dotenv from 'dotenv'

import routes from './routes'

dotenv.config()

class App {

	public express

	constructor(){
		this.express = express()
		this.middlewares()
		this.routes()
	}

	middlewares(){
		this.express.use(express.json())
	}

	routes(){
		this.express.use(routes)
		// this.express.use(root)
		// this.express.use(userRoute)
		// this.express.use(emailConfirmation)
		// this.express.use(login)
	}
}

export default new App().express