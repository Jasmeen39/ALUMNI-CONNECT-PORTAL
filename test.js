// test/insertAdminUser.js

const bcrypt = require('bcrypt');
const mysql = require('mysql2'); // Replace with your actual DB client (e.g., Sequelize, Prisma, etc.)
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,  // Use your database host
  user: process.env.DB_USER,  // Use your database username
  password: process.env.DB_PASSWORD, // Use your database password
  database: process.env.DB_NAME // Your database name
});

// Admin credentials
const adminEmail = 'admin@alumniconnect.com';
const adminPassword = 'pass@admin123';

// Hash the admin password
const insertAdminUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);  // Hash password

    // Insert the admin user into the database
    const query = 'INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)';
    const values = ['admin', 'admin', adminEmail, hashedPassword, 'admin']; // 5 values for 5 columns

    db.execute(query, values, (err, result) => {
      if (err) {
        console.error('Error inserting admin user:', err);
      } else {
        console.log('Admin user inserted successfully:', result);
      }

      db.end(); // Close the DB connection
    });
  } catch (error) {
    console.error('Error hashing password:', error);
  }
};

// Call the function to insert the admin user
insertAdminUser();
