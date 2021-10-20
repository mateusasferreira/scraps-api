import express from 'express'
import dotenv from 'dotenv'

//routes
import root from '@routes/root'
import userRoute from '@routes/user'
import emailConfirmation from '@routes/confirmEmail'
import login from '@routes/login'

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
		this.express.use(root)
		this.express.use(userRoute)
		this.express.use(emailConfirmation)
		this.express.use(login)
	}
}

export default new App().express