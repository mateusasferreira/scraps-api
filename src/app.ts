import 'reflect-metadata'
import express from 'express'
import root from './routes/root'

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
	}
}

export default new App().express