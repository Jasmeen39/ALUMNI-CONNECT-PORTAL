import { withAuth } from "@/middleware/auth.middleware";
import db from "@/lib/db";

async function handler(req, res) {
  const { userId: loggedInUserId } = req.user;

  if (req.method === "GET") {
    try {
      // First, get all unique chat partners
      const [chatPartners] = await db.query(
        `SELECT DISTINCT 
          CASE 
            WHEN senderId = ? THEN receiverId 
            ELSE senderId 
          END as partnerId
         FROM messages
         WHERE senderId = ? OR receiverId = ?`,
        [loggedInUserId, loggedInUserId, loggedInUserId]
      );

      if (!chatPartners || chatPartners.length === 0) {
        return res.status(200).json([]);
      }

      // Get user details and last message for each chat partner
      const partnerIds = chatPartners.map(p => p.partnerId);
      const [chats] = await db.query(
        `SELECT 
          u.userId, 
          u.firstName, 
          u.lastName,
          (
            SELECT content 
            FROM messages 
            WHERE (senderId = u.userId AND receiverId = ?) 
               OR (senderId = ? AND receiverId = u.userId) 
            ORDER BY timestamp DESC 
            LIMIT 1
          ) as lastMessage,
          (
            SELECT timestamp 
            FROM messages 
            WHERE (senderId = u.userId AND receiverId = ?) 
               OR (senderId = ? AND receiverId = u.userId) 
            ORDER BY timestamp DESC 
            LIMIT 1
          ) as lastMessageTime
        FROM users u
        WHERE u.userId IN (?)`,
        [loggedInUserId, loggedInUserId, loggedInUserId, loggedInUserId, partnerIds]
      );

      // Sort chats by last message time
      const sortedChats = chats.sort((a, b) => 
        new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
      );

      return res.status(200).json(sortedChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).json({ message: "Method Not Allowed" });
}

// Pass allowed roles to withAuth
export default withAuth(handler, ["admin", "faculty", "student", "alumni"]);
