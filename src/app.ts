import express from 'express'
import dotenv from 'dotenv'
import routes from './routes'
import errorHandler from './middlewares/errorHandler'
import helmet from 'helmet'
import jwtStrategy from './middlewares/passport'
import passport from 'passport'

dotenv.config()

const app = express()

jwtStrategy(passport)

app.use(passport.initialize())

app.use(helmet())
app.use(express.json())
app.use(routes)
app.use(errorHandler)

export default app