import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'webraffle',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function initDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
    });
    
    await connection.execute('CREATE DATABASE IF NOT EXISTS webraffle');
    await connection.end();

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS lottery_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL COMMENT '用户名',
        phone VARCHAR(20) NOT NULL COMMENT '手机号',
        prize VARCHAR(50) NOT NULL COMMENT '奖品',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '抽奖时间',
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='抽奖实况表'
    `);
    
    console.log('Database and table initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export default pool;