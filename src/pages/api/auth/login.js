import db from "@/lib/db";
import bcrypt from "bcrypt";
import { generateToken } from "@/config/jwt";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    console.log("Login attempt for email:", email);
    
    // Find user by email
    const [userResult] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    
    console.log("User query result:", userResult.length > 0 ? "User found" : "User not found");

    if (userResult.length === 0) {
      console.log("Login failed: User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = userResult[0];
    console.log("User found with role:", user.role);

    // Check approval status
    if (user.isApproved === 0) {
      console.log("Login failed: Account not approved");
      return res.status(401).json({ message: "Your account is not yet approved by the admin." });
    }

    // Compare hashed passwords
    console.log("Comparing passwords...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Login failed: Invalid password");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    console.log("Generating token...");
    const token = await generateToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
    });
    console.log("Token generated successfully");

    // Set token in cookie - FIXED COOKIE SETTINGS
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: false, // Set to false for local development
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);
    console.log("Cookie set in response");

    // Log token for debugging
    console.log("Login successful for user:", user.email);
    
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isApproved: !!user.isApproved, // Ensures it's returned as boolean
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error", details: error.message });
  }
}
