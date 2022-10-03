import 'reflect-metadata'
import '@config/ioc.config'
import app from './app'

app.listen(process.env.PORT, () => console.log('server running'))
