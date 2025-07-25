import { withAuth } from "@/middleware/auth.middleware";
import db from "@/lib/db";

export default async function handler(req, res) {
  try {
    // Apply auth middleware
    await withAuth(async (req, res) => {
      const { userId } = req.user;

      switch (req.method) {
        case "GET":
          // Get all conversations for the user
          const [conversations] = await db.query(
            `SELECT DISTINCT 
             CASE 
               WHEN m.senderId = ? THEN m.receiverId 
               ELSE m.senderId 
             END as otherUserId,
             u.firstName, u.lastName, u.profilePicture,
             m.content as lastMessage,
             m.createdAt as lastMessageTime,
             COUNT(CASE WHEN m.isRead = 0 AND m.receiverId = ? THEN 1 END) as unreadCount
             FROM messages m
             JOIN users u ON CASE 
               WHEN m.senderId = ? THEN m.receiverId 
               ELSE m.senderId 
             END = u.userId
             WHERE m.senderId = ? OR m.receiverId = ?
             GROUP BY otherUserId
             ORDER BY lastMessageTime DESC`,
            [userId, userId, userId, userId, userId]
          );

          return res.status(200).json(conversations);

        case "POST":
          const { receiverId, content } = req.body;

          // Validate required fields
          if (!receiverId || !content) {
            return res.status(400).json({ message: "Receiver ID and content are required" });
          }

          // Create new message
          const [result] = await db.query(
            "INSERT INTO messages (senderId, receiverId, content) VALUES (?, ?, ?)",
            [userId, receiverId, content]
          );

          return res.status(201).json({
            message: "Message sent successfully",
            messageId: result.insertId,
          });

        default:
          res.setHeader("Allow", ["GET", "POST"]);
          return res.status(405).json({ message: `Method ${req.method} not allowed` });
      }
    })(req, res);
  } catch (error) {
    console.error("Messages API error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
}
