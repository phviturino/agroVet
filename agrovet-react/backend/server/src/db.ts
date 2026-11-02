import mysql from 'mysql2/promise';

// Cria um pool de conexões reutilizável com o MySQL
export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'senhadificilpradedeu123',
  database: process.env.DB_NAME || 'meu_banco',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});