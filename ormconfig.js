const baseDir = process.env.NODE_ENV === 'production' ? 'dist/' : 'src/'

module.exports = { 
    name: "default",
    type: process.env.DB_CONNECTION,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: true,
    synchronize: false,
    entities: [baseDir + 'models/*.{js,ts}'],
	  migrations: [baseDir + 'migrations/*.{js,ts}'],
    cli: {
      'entitiesDir': baseDir + 'models',
      'migrationsDir': baseDir + 'migrations'
    }    
  }