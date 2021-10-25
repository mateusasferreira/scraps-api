import app from './app'
import 'reflect-metadata'
import '@config/database.config'

app.listen(process.env.PORT, () => console.log('servidor rodando'))