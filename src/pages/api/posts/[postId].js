import { withAuth } from "@/middleware/auth.middleware";
import db from "@/lib/db";

async function handler(req, res) {
  const { postId } = req.query;
  const { userId, role } = req.user;

  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  switch (req.method) {
    case "GET":
      // Get post with user details
      const [posts] = await db.query(
        `SELECT p.*, 
         u.firstName, u.lastName, u.profilePicture
         FROM posts p
         LEFT JOIN users u ON p.userId = u.userId
         WHERE p.postId = ?`,
        [postId]
      );

      if (posts.length === 0) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json(posts[0]);

    case "DELETE":
      // Check if post exists
      const [post] = await db.query("SELECT userId FROM posts WHERE postId = ?", [postId]);
      if (post.length === 0) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Allow deletion if user is admin or owns the post
      if (role !== "admin" && post[0].userId !== userId) {
        return res.status(403).json({ message: "You can only delete your own posts" });
      }

      // Delete the post
      await db.query("DELETE FROM posts WHERE postId = ?", [postId]);
      return res.status(200).json({ message: "Post deleted successfully" });

    case "PUT":
      const { content, imageUrl } = req.body;

      // Check if post exists
      const [existingPost] = await db.query("SELECT userId FROM posts WHERE postId = ?", [postId]);
      if (existingPost.length === 0) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Allow update if user is admin or owns the post
      if (role !== "admin" && existingPost[0].userId !== userId) {
        return res.status(403).json({ message: "You can only update your own posts" });
      }

      // Update post
      await db.query(
        "UPDATE posts SET content = ?, imageUrl = ? WHERE postId = ?",
        [content, imageUrl, postId]
      );

      return res.status(200).json({ message: "Post updated successfully" });

    default:
      res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

// Allow access to all authenticated users for GET, but restrict DELETE and PUT to admins or post owners
export default withAuth(handler, ["admin", "alumni", "faculty", "student"]);
