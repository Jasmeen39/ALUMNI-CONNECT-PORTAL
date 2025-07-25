import { authMiddleware } from "@/middleware/auth.middleware";
import db from "@/lib/db";

export default async function handler(req, res) {
  try {
    // Apply auth middleware
    await authMiddleware(req, res);

    const { userId } = req.user;

    switch (req.method) {
      case "GET":
        // Get user profile
        const [user] = await db.query(
          "SELECT userId, firstName, lastName, email, graduationYear, role, isApproved FROM users WHERE userId = ?",
          [userId]
        );

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);

      case "PUT":
        const { firstName, lastName, email, graduationYear } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        // Update user profile
        await db.query(
          "UPDATE users SET firstName = ?, lastName = ?, email = ?, graduationYear = ? WHERE userId = ?",
          [firstName, lastName, email, graduationYear, userId]
        );

        return res.status(200).json({ message: "Profile updated successfully" });

      case "DELETE":
        // Delete user profile
        await db.query("DELETE FROM users WHERE userId = ?", [userId]);
        return res.status(200).json({ message: "Profile deleted successfully" });

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Profile API error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
}
