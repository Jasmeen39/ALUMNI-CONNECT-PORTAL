import { withAuth } from "@/middleware/auth.middleware";
import db from "@/lib/db";

async function handler(req, res) {
  const { userId } = req.user;

  switch (req.method) {
    case "GET":
      // Get all posts with user details
      const [posts] = await db.query(
        `SELECT p.*, 
         u.firstName, u.lastName
         FROM posts p
         LEFT JOIN users u ON p.userId = u.userId
         ORDER BY p.createdAt DESC`
      );

      return res.status(200).json(posts);

    case "POST":
      const { content } = req.body;

      // Validate required fields
      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      // Create new post
      const [result] = await db.query(
        "INSERT INTO posts (userId, content) VALUES (?, ?)",
        [userId, content]
      );

      return res.status(201).json({
        message: "Post created successfully",
        postId: result.insertId,
      });

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

export default withAuth(handler);
