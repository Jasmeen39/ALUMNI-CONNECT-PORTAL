import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let pool;

// Prevent multiple pool instances in development (Hot Reloading Issue)
if (!global.dbPool) {
  global.dbPool = mysql.createPool({
    host: process.env.AZURE_DB_HOST || 'localhost',
    user: process.env.AZURE_DB_USER || 'root',
    password: process.env.AZURE_DB_PASSWORD || 'admin',
    database: process.env.AZURE_DB_NAME || 'alumni_connect_portal',
    waitForConnections: true,
    connectionLimit: 10,  // Allows up to 10 simultaneous connections
    queueLimit: 0,
    ssl: { rejectUnauthorized: true },
  });
}

pool = global.dbPool;

// Function to get a database connection
export const getConnection = async () => {
  return await pool.getConnection();
};

// Export the connection pool for direct queries
export default pool;
