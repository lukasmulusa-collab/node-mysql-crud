const mysql = require('mysql2');
require('dotenv').config();

console.log('Connecting to DB Host:', process.env.DB_HOST);
console.log('Connecting as DB User:', process.env.DB_USER);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 28737,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD || '').trim(),
  database: process.env.DB_NAME || 'defaultdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool.promise();