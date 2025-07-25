import db from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { senderId, receiverId, content } = req.body;

  if (!senderId || !receiverId || !content.trim()) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.query(
      "INSERT INTO Messages (senderId, receiverId, content) VALUES (?, ?, ?)",
      [senderId, receiverId, content]
    );

    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
