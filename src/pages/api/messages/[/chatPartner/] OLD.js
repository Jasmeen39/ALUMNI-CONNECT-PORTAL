import db from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId, chatPartner } = req.query;

  if (!userId || !chatPartner) {
    return res.status(400).json({ message: "Missing user ID or chat partner ID" });
  }

  try {
    const messages = await db.query(
      `SELECT * FROM Messages 
       WHERE (senderId = ? AND receiverId = ?) 
          OR (senderId = ? AND receiverId = ?) 
       ORDER BY timestamp ASC`,
      [userId, chatPartner, chatPartner, userId]
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
