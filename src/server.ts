import app from './app'
import 'reflect-metadata'
import '@config/database.config'

const port = process.env.PORT as unknown as number

app.listen(port, '0.0.0.0', 511, () => console.log('servidor on'))
