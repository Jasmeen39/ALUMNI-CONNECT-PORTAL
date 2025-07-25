import { verifyToken } from "@/config/jwt";
import db from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Me API - No token provided in Authorization header");
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    
    // Log token for debugging
    console.log("Me API - Token received:", token.substring(0, 20) + "...");

    // Verify token
    try {
      const payload = await verifyToken(token);
      console.log("Me API - Token verified, payload:", payload);

      // Get user from database
      const [userResult] = await db.query(
        "SELECT userId, firstName, lastName, email, role, isApproved FROM Users WHERE userId = ?",
        [payload.userId]
      );

      if (userResult.length === 0) {
        // For admin users, return basic info from token if DB lookup fails
        if (payload.role === 'admin') {
          console.log("Me API - User not found in DB, returning admin info from token");
          return res.status(200).json({
            userId: payload.userId,
            firstName: payload.firstName || '',
            lastName: payload.lastName || '',
            email: payload.email || '',
            role: 'admin',
            isApproved: true,
          });
        }
        return res.status(404).json({ message: "User not found" });
      }

      const user = userResult[0];

      // Return user data
      return res.status(200).json({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isApproved: !!user.isApproved, // Ensures it's returned as boolean
      });
    } catch (verifyError) {
      console.error("Me API - Token verification failed:", verifyError);
      
      // Check if token is expired
      if (verifyError.message === "Token has expired") {
        return res.status(401).json({ message: "Token has expired" });
      }
      
      // Check if token is invalid
      if (verifyError.message === "Invalid token") {
        return res.status(401).json({ message: "Invalid token" });
      }
      
      return res.status(401).json({ message: "Token verification failed" });
    }
  } catch (error) {
    console.error("Me API error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
