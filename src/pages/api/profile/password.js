import db from "@/lib/db";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId, oldPassword, newPassword } = req.body; // ✅ Extract userId from request body

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "Old password, and new password are required" });
  }
  //console.log("User ID:", userId); // Debugging
  try {
    // Fetch user's current password from DB
    const [rows] = await db.query("SELECT password FROM Users WHERE userId = ?", [userId]);
    const user = rows[0]; // Ensure we're extracting from the correct array
      
    console.log("User fetched:", user); // Debugging
      
    if (!user || !user.password) {
      return res.status(404).json({ message: "User not found" });
    }
    


    // Check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Hash new password and update DB
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE Users SET password = ? WHERE userId = ?", [hashedPassword, userId]);

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
