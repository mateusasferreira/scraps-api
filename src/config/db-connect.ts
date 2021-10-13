import {createConnection} from 'typeorm'

createConnection()
	.then(() => console.log('succesfully connected to database'))
	.catch(e => console.log(e))
