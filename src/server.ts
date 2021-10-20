import app from './app'
import 'reflect-metadata'
import '@config/db-connect'

app.listen(process.env.PORT, () => console.log('servidor rodando'))