
// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

// dotenv.config();

// let db: mysql.Connection;

// export const initDb = async () => {
//   db = await mysql.createConnection({
//     host: process.env.DB_HOST!,
//     user: process.env.DB_USER!,
//     password: process.env.DB_PASS!,
//     database: process.env.DB_NAME!,
//   });
// };

// export const getDb = () => db;

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool: mysql.Pool;

export const initDb = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    await pool.getConnection(); // test connection
    console.log('✅ Connected to MySQL database');
  } catch (error) {
    console.error('❌ Failed to connect to DB:', error);
    throw error;
  }
};

export const getDb = () => {
  if (!pool) throw new Error('Database not initialized');
  return pool;
};
console.log({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
  });
  if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    console.warn('⚠️ Missing DB_USER or DB_PASSWORD in .env file');
  }
  
