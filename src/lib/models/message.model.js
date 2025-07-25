import pool from '../lib/db.js';

const Message = {
  // Send a new message
  sendMessage: async (senderId, receiverId, content) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        "INSERT INTO Messages (senderId, receiverId, content) VALUES (?, ?, ?)",
        [senderId, receiverId, content]
      );
      connection.release();
      return { messageId: result.insertId, senderId, receiverId, content };
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Database error");
    }
  },

  // Get all messages between two users
  getMessagesBetweenUsers: async (userId1, userId2) => {
    try {
      const connection = await pool.getConnection();
      const [results] = await connection.query(
        "SELECT * FROM Messages WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?) ORDER BY timestamp ASC",
        [userId1, userId2, userId2, userId1]
      );
      connection.release();
      return results;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw new Error("Database error");
    }
  },

  // Delete a message
  deleteMessage: async (messageId) => {
    try {
      const connection = await pool.getConnection();
      await connection.query("DELETE FROM Messages WHERE messageId = ?", [messageId]);
      connection.release();
      return true;
    } catch (error) {
      console.error("Error deleting message:", error);
      throw new Error("Database error");
    }
  },
};

export default Message;
