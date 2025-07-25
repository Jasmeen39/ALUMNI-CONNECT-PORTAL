import { authMiddleware } from "@/middleware/auth.middleware";
import db from "@/lib/db";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    // Apply auth middleware
    await authMiddleware(req, res);

    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

    const { userId } = req.user;

    // Parse the form data
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    const file = files.image?.[0];
    if (!file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: "Invalid file type. Only JPEG, PNG, and GIF are allowed." });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: "File size too large. Maximum size is 5MB." });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const ext = path.extname(file.originalFilename);
    const filename = `${userId}${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Move file to uploads directory
    fs.renameSync(file.filepath, filepath);

    // Update user's profile picture in database
    const imageUrl = `/uploads/profiles/${filename}`;
    await db.query("UPDATE users SET profilePicture = ? WHERE userId = ?", [imageUrl, userId]);

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Profile upload error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
} 