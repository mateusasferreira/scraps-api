import {createConnection} from 'typeorm'

createConnection('default')
	.then(() => console.log('succesfully connected to database'))
	.catch(e => console.log(e))