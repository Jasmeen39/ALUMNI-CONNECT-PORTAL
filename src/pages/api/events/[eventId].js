import { withAuth } from "@/middleware/auth.middleware";
import db from "@/lib/db";

async function handler(req, res) {
  const { eventId } = req.query;
  const { userId, role } = req.user;

  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  switch (req.method) {
    case "GET":
      // Get event details
      const [events] = await db.query(
        `SELECT e.*, u.firstName, u.lastName
         FROM events e
         LEFT JOIN users u ON e.organizerId = u.userId
         WHERE e.eventId = ?`,
        [eventId]
      );

      if (events.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }

      return res.status(200).json(events[0]);

    case "PUT":
      // Check if user is the organizer of the event or an admin
      const [existingEvent] = await db.query(
        "SELECT organizerId FROM events WHERE eventId = ?",
        [eventId]
      );

      if (existingEvent.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Allow admins to edit any event
      if (role !== "admin" && existingEvent[0].organizerId !== userId) {
        return res.status(403).json({ message: "You can only update your own events" });
      }

      const { title, description, date, location } = req.body;

      // Validate required fields
      if (!title || !date) {
        return res.status(400).json({ message: "Title and date are required" });
      }

      // Update event
      await db.query(
        "UPDATE events SET title = ?, description = ?, date = ?, location = ? WHERE eventId = ?",
        [title, description, date, location, eventId]
      );

      return res.status(200).json({ message: "Event updated successfully" });

    case "DELETE":
      // Check if user is the organizer of the event or an admin
      const [eventToDelete] = await db.query(
        "SELECT organizerId FROM events WHERE eventId = ?",
        [eventId]
      );

      if (eventToDelete.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Allow admins to delete any event
      if (role !== "admin" && eventToDelete[0].organizerId !== userId) {
        return res.status(403).json({ message: "You can only delete your own events" });
      }

      // Delete event
      await db.query("DELETE FROM events WHERE eventId = ?", [eventId]);

      return res.status(200).json({ message: "Event deleted successfully" });

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

export default withAuth(handler);
