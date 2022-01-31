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
    entities: ["src/models/*.ts"],
    subscribers: [
      "src/subscriber/**/*.ts"
    ],
    migrations: ["src/migrations/*.ts"],
    cli: {
      "entitiesDir": "src/models",
      "migrationsDir": "src/migrations"
    }  
  }