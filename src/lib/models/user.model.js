import pool from '../lib/db.js';
import bcrypt from 'bcrypt';

const User = {
  // Create a new user
  createUser: async (firstName, lastName, email, password, role, graduationYear) => {
    try {
      const connection = await pool.getConnection();
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await connection.query(
        "INSERT INTO Users (firstName, lastName, email, password, role, graduationYear) VALUES (?, ?, ?, ?, ?, ?)",
        [firstName, lastName, email, hashedPassword, role, graduationYear]
      );
      connection.release();
      return { userId: result.insertId, firstName, lastName, email, role };
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Database error");
    }
  },

  // Find user by email
  findUserByEmail: async (email) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query("SELECT * FROM Users WHERE email = ?", [email]);
      connection.release();
      return result[0];
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Database error");
    }
  },

  // Find user by ID
  findUserById: async (userId) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query("SELECT * FROM Users WHERE userId = ?", [userId]);
      connection.release();
      return result[0];
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw new Error("Database error");
    }
  },

  // Update user profile
  updateUser: async (userId, firstName, lastName, graduationYear) => {
    try {
      const connection = await pool.getConnection();
      await connection.query(
        "UPDATE Users SET firstName = ?, lastName = ?, graduationYear = ? WHERE userId = ?",
        [firstName, lastName, graduationYear, userId]
      );
      connection.release();
      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw new Error("Database error");
    }
  },

  // Update user password
  updateUserPassword: async (userId, newPassword) => {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const connection = await pool.getConnection();
      await connection.query("UPDATE Users SET password = ? WHERE userId = ?", [hashedPassword, userId]);
      connection.release();
      return true;
    } catch (error) {
      console.error("Error updating user password:", error);
      throw new Error("Database error");
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const connection = await pool.getConnection();
      await connection.query("DELETE FROM Users WHERE userId = ?", [userId]);
      connection.release();
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Database error");
    }
  },

  // Get all users (Admin Only)
  getAllUsers: async () => {
    try {
      const connection = await pool.getConnection();
      const [results] = await connection.query(
        "SELECT userId, firstName, lastName, email, role FROM Users"
      );
      connection.release();
      return results;
    } catch (error) {
      console.error("Error retrieving all users:", error);
      throw new Error("Database error");
    }
  },

  // Update user role (Admin Only)
  updateUserRole: async (userId, role) => {
    try {
      const connection = await pool.getConnection();
      await connection.query("UPDATE Users SET role = ? WHERE userId = ?", [role, userId]);
      connection.release();
      return true;
    } catch (error) {
      console.error("Error updating user role:", error);
      throw new Error("Database error");
    }
  },

  // Search users by name, email, or role
  searchUsers: async (query) => {
    try {
      const searchQuery = `%${query}%`;
      const connection = await pool.getConnection();
      const [results] = await connection.query(
        "SELECT userId, firstName, lastName, email, role FROM Users WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR role LIKE ?",
        [searchQuery, searchQuery, searchQuery, searchQuery]
      );
      connection.release();
      return results;
    } catch (error) {
      console.error("Error searching users:", error);
      throw new Error("Database error");
    }
  },
};

export default User;
