import { withAuth } from "@/middleware/auth.middleware";
import db from "@/lib/db";

const handler = async (req, res) => {
  try {
    const { userId: profileUserId } = req.query;
    const { userId: currentUserId } = req.user;

    if (!profileUserId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    switch (req.method) {
      case "GET":
        // Get user profile with post count
        const [users] = await db.query(
          `SELECT 
            u.userId,
            u.firstName,
            u.lastName,
            u.email,
            u.role,
            u.graduationYear,
            u.createdAt,
            u.updatedAt,
            u.isApproved,
            COALESCE(COUNT(DISTINCT p.postId), 0) as postCount
           FROM users u
           LEFT JOIN posts p ON u.userId = p.userId
           WHERE u.userId = ?
           GROUP BY u.userId`,
          [profileUserId]
        );

        if (!users || users.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        const user = users[0];
        
        // Format user data according to the actual schema
        const formattedUser = {
          userId: Number(user.userId),
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          role: user.role || "alumni",
          graduationYear: user.graduationYear ? Number(user.graduationYear) : null,
          postCount: Number(user.postCount),
          isApproved: Boolean(user.isApproved),
          createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
          updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : null
        };

        return res.status(200).json(formattedUser);

      case "PUT":
        // Check if user is updating their own profile
        if (currentUserId.toString() !== profileUserId.toString()) {
          return res.status(403).json({ message: "You can only update your own profile" });
        }

        const {
          firstName,
          lastName,
          graduationYear
        } = req.body;

        // Update user profile with only the fields that exist in the table
        await db.query(
          `UPDATE users 
           SET firstName = ?, lastName = ?, graduationYear = ?
           WHERE userId = ?`,
          [
            firstName,
            lastName,
            graduationYear,
            profileUserId
          ]
        );

        return res.status(200).json({ message: "Profile updated successfully" });

      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Profile API error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export default withAuth(handler);
