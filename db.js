const mysql = require('mysql2');
require('dotenv').config();

// 1. Create the pool first
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'defaultdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false
});

// 2. Export the promise wrapper AT THE BOTTOM
module.exports = pool.promise();