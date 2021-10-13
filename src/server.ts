import app from './app'
import '@config/db-connect'
import dotenv from 'dotenv'

dotenv.config()

app.listen(process.env.PORT, () => console.log('servidor rodando'))