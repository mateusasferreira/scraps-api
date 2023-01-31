import { NestFactory } from '@nestjs/core'
import 'reflect-metadata'
import { AppModule } from './app.module'
import dotenv from 'dotenv'
// import '@config/ioc.config'
// import app from './app'

// app.listen(process.env.PORT, () => console.log('server running'))

dotenv.config()

async function init() {
  const app = await NestFactory.create(AppModule)
  await app.listen(3333)
    .then(() => console.log('Servidor rodando na porta 3333!!'))
}

init()