import pool from '../lib/db.js';

const Report = {
  // Generate a user activity report (Admin Only)
  generateUserReport: async () => {
    try {
      const connection = await pool.getConnection();
      const [results] = await connection.query(
        `SELECT 
            Users.userId, 
            Users.firstName, 
            Users.lastName, 
            Users.email, 
            Users.role, 
            COUNT(DISTINCT Posts.postId) AS postsCreated, 
            COUNT(DISTINCT Messages.messageId) AS messagesSent, 
            COUNT(DISTINCT Events.eventId) AS eventsOrganized
         FROM Users
         LEFT JOIN Posts ON Users.userId = Posts.userId
         LEFT JOIN Messages ON Users.userId = Messages.senderId
         LEFT JOIN Events ON Users.userId = Events.organizerId
         GROUP BY Users.userId`
      );
      connection.release();
      return results;
    } catch (error) {
      console.error("Error generating user report:", error);
      throw new Error("Database error");
    }
  },

  // Generate an alumni-specific report (Admin Only)
  generateAlumniReport: async () => {
    try {
      const connection = await pool.getConnection();
      const [results] = await connection.query(
        `SELECT 
            Users.userId, 
            Users.firstName, 
            Users.lastName, 
            Users.email, 
            Users.graduationYear, 
            COUNT(DISTINCT Posts.postId) AS postsCreated, 
            COUNT(DISTINCT Messages.messageId) AS messagesSent, 
            COUNT(DISTINCT Events.eventId) AS eventsOrganized
         FROM Users
         LEFT JOIN Posts ON Users.userId = Posts.userId
         LEFT JOIN Messages ON Users.userId = Messages.senderId
         LEFT JOIN Events ON Users.userId = Events.organizerId
         WHERE Users.role = 'alumni'
         GROUP BY Users.userId`
      );
      connection.release();
      return results;
    } catch (error) {
      console.error("Error generating alumni report:", error);
      throw new Error("Database error");
    }
  },
};

export default Report;
