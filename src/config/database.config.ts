import path from 'path'
import {DataSource} from 'typeorm'

const dataSource = new DataSource({
	type: process.env.DB_CONNECTION as any,
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [path.join(__dirname, '../models/*.{js,ts}')]
})

dataSource.initialize()


export default dataSource