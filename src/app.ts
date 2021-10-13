import 'reflect-metadata'
import express from 'express'
import root from '@routes/root'
import userRoute from '@routes/user'

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
		this.express.use(root)
		this.express.use(userRoute)
	}
}

export default new App().express