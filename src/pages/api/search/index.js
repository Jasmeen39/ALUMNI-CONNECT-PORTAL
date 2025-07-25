import db from "../../../lib/db"; // Import your database connection

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    // Query MySQL database for matching users
    const [users] = await db.query(
      `SELECT userId, firstName, lastName, email FROM users 
       WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ? 
       LIMIT 10`,
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
