import { verifyToken } from "../config/jwt";
import { parse } from "cookie";

export const withAuth = (handler, roles = []) => {
  return async (req, res) => {
    try {
      let token;
      
      // Try to get token from Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else {
        // Try to get token from cookies
        const cookies = parse(req.headers.cookie || "");
        token = cookies.token;
      }

      if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
      }

      try {
        const decoded = await verifyToken(token);
        const allowedRoles = roles.length > 0 ? roles : ["alumni", "faculty", "student", "admin"];
        
        if (!allowedRoles.includes(decoded.role)) {
          return res.status(403).json({ message: "Access denied. You do not have permission." });
        }

        req.user = decoded; // Attach user to request
        return handler(req, res);
      } catch (tokenError) {
        console.error("Token verification failed:", tokenError);
        if (tokenError.message.includes('expired')) {
          return res.status(401).json({ message: "Token has expired. Please log in again." });
        }
        return res.status(401).json({ message: "Invalid token." });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };
};
