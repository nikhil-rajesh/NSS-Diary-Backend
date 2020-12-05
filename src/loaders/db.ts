import mysql from 'mysql2/promise';
import config from '../config';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPass,
  database: config.dbDatabase,
});

export default pool;
