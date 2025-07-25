import { withAuth } from "@/middleware/auth.middleware";
import db from "@/lib/db";

async function handler(req, res) {
  try {
    const { userId: chatPartnerId } = req.query;
    const { userId: currentUserId } = req.user;

    if (!chatPartnerId) {
      return res.status(400).json({ message: "Chat partner ID is required" });
    }

    switch (req.method) {
      case "GET":
        // Get messages between current user and chat partner
        const [messages] = await db.query(
          `SELECT m.*, 
           sender.firstName as senderFirstName, sender.lastName as senderLastName,
           receiver.firstName as receiverFirstName, receiver.lastName as receiverLastName
           FROM messages m
           LEFT JOIN users sender ON m.senderId = sender.userId
           LEFT JOIN users receiver ON m.receiverId = receiver.userId
           WHERE (m.senderId = ? AND m.receiverId = ?)
           OR (m.senderId = ? AND m.receiverId = ?)
           ORDER BY m.timestamp ASC`,
          [currentUserId, chatPartnerId, chatPartnerId, currentUserId]
        );

        return res.status(200).json(messages);

      case "POST":
        const { content } = req.body;

        if (!content) {
          return res.status(400).json({ message: "Message content is required" });
        }

        // Check if chat partner exists
        const [chatPartner] = await db.query("SELECT userId FROM users WHERE userId = ?", [chatPartnerId]);
        if (chatPartner.length === 0) {
          return res.status(404).json({ message: "Chat partner not found" });
        }

        // Create new message
        const [result] = await db.query(
          "INSERT INTO messages (senderId, receiverId, content) VALUES (?, ?, ?)",
          [currentUserId, chatPartnerId, content]
        );

        return res.status(201).json({
          message: "Message sent successfully",
          messageId: result.insertId
        });

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Messages API error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
}

export default withAuth(handler);
