import 'reflect-metadata'
import '@config/db-connect.ts'
import express from 'express'
import root from './routes/root'

import dotenv from 'dotenv'

dotenv.config({
	path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

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