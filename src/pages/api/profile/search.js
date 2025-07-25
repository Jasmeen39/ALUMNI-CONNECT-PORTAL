import { authMiddleware } from "@/middleware/auth.middleware";
import db from "@/lib/db";

export default async function handler(req, res) {
  try {
    // Apply auth middleware
    await authMiddleware(req, res);

    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

    const { q: searchQuery } = req.query;

    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Search users by name or email
    const [users] = await db.query(
      `SELECT userId, firstName, lastName, email, graduationYear, role 
       FROM users 
       WHERE (firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)
       AND isApproved = 1
       LIMIT 10`,
      [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
    );

    return res.status(200).json(users);
  } catch (error) {
    console.error("Profile search error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
} 