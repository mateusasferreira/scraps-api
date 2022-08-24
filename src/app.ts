// import 'reflect-metadata'
import express from 'express'
import dotenv from 'dotenv'
import routes from './routes'
import errorHandler from '@middlewares/errorHandler'
import helmet from 'helmet'

dotenv.config()

const app = express()

app.use(helmet())
app.use(express.json())
app.use(routes)
app.use(errorHandler)

export default app