import pool from '../lib/db.js';

const Post = {
  // Create a new post
  createPost: async (userId, content) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        "INSERT INTO Posts (userId, content) VALUES (?, ?)",
        [userId, content]
      );
      connection.release();
      return { postId: result.insertId, userId, content };
    } catch (error) {
      console.error("Error creating post:", error);
      throw new Error("Database error");
    }
  },

  // Get all posts
  getAllPosts: async () => {
    try {
      const connection = await pool.getConnection();
      const [results] = await connection.query("SELECT * FROM Posts ORDER BY createdAt DESC");
      connection.release();
      return results;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw new Error("Database error");
    }
  },

  // Get posts by a specific user
  getPostsByUser: async (userId) => {
    try {
      const connection = await pool.getConnection();
      const [results] = await connection.query(
        "SELECT * FROM Posts WHERE userId = ? ORDER BY createdAt DESC",
        [userId]
      );
      connection.release();
      return results;
    } catch (error) {
      console.error("Error fetching user posts:", error);
      throw new Error("Database error");
    }
  },

  // Delete a post
  deletePost: async (postId) => {
    try {
      const connection = await pool.getConnection();
      await connection.query("DELETE FROM Posts WHERE postId = ?", [postId]);
      connection.release();
      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw new Error("Database error");
    }
  },
};

export default Post;
