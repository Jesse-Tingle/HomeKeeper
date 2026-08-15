const { Pool } = require("pg");
const env = require("./env");

const databaseConfig = env.DATABASE_URL
  ? {
    connectionString: env.DATABASE_URL,
  }
  : {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  };

const pool = new Pool(databaseConfig);

module.exports = pool;