import express, {Express} from 'express'
import dotenv from 'dotenv'
import routes from './routes'

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
		this.express.use('/', routes)
	}
}

export default new App().express