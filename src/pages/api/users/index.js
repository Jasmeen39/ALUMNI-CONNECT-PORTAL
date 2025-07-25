import db from "../../../lib/db"; // Import your database connection

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Query the MySQL database to fetch all users
    const [users] = await db.query(
        "SELECT userId, firstName, lastName, email, isApproved FROM users WHERE firstName != 'admin' AND lastName != 'admin'"
      );      
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
