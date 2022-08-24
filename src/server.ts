import app from './app'
import 'reflect-metadata'
import '@config/database.config'
// import '@config/ioc.config'

app.listen(process.env.PORT, () => console.log('server running'))
