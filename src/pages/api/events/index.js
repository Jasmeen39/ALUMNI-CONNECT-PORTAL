import { withAuth } from "@/middleware/auth.middleware";
import db from "@/lib/db";

async function handler(req, res) {
  const { userId } = req.user;

  switch (req.method) {
    case "GET":
      // Get all events
      const [events] = await db.query(
        `SELECT e.*, u.firstName, u.lastName
         FROM events e
         LEFT JOIN users u ON e.organizerId = u.userId
         ORDER BY e.date ASC`
      );

      return res.status(200).json(events);

    case "POST":
      const { title, description, date, location } = req.body;

      // Validate required fields
      if (!title || !date) {
        return res.status(400).json({ message: "Title and date are required" });
      }

      // Create new event
      const [result] = await db.query(
        "INSERT INTO events (title, description, date, location, organizerId) VALUES (?, ?, ?, ?, ?)",
        [title, description, date, location, userId]
      );

      return res.status(201).json({
        message: "Event created successfully",
        eventId: result.insertId,
      });

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

export default withAuth(handler);
