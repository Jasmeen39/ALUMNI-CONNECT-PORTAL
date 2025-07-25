import db from "../../../lib/db"; // Import your database connection

// Handler for both approve and delete operations
export default async function handler(req, res) {
  const { userId } = req.query; // Extract the userId from the URL parameters

  switch (req.method) {
    case "PATCH":
      // Approve User
      try {
        // Query to update the user's approval status to true
        const [result] = await db.query(
          "UPDATE users SET isApproved = TRUE WHERE userId = ?",
          [userId]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User not found or already approved" });
        }

        return res.status(200).json({ 
          message: "User approved successfully",
          success: true
        });
      } catch (err) {
        console.error("Error approving user:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

    case "DELETE":
      // Delete User
      try {
        // Query to delete the user
        const [result] = await db.query(
          "DELETE FROM users WHERE userId = ?",
          [userId]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        return res.status(204).end(); // No content, successful deletion
      } catch (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
