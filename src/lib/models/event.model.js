import pool from '../lib/db.js';

const Event = {
  // Create a new event
  createEvent: async (title, description, date, location, organizerId) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        "INSERT INTO Events (title, description, date, location, organizerId) VALUES (?, ?, ?, ?, ?)",
        [title, description, date, location, organizerId]
      );
      connection.release(); // Release connection
      return { eventId: result.insertId, title, description, date, location, organizerId };
    } catch (error) {
      console.error("Error creating event:", error);
      throw new Error("Database error");
    }
  },

  // Get event by ID
  getEventById: async (eventId) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query("SELECT * FROM Events WHERE eventId = ?", [eventId]);
      connection.release();
      return result[0];
    } catch (error) {
      console.error("Error fetching event:", error);
      throw new Error("Database error");
    }
  },

  // Get all events
  getAllEvents: async () => {
    try {
      const connection = await pool.getConnection();
      const [results] = await connection.query("SELECT * FROM Events");
      connection.release();
      return results;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw new Error("Database error");
    }
  },

  // Update event
  updateEvent: async (eventId, title, description, date, location) => {
    try {
      const connection = await pool.getConnection();
      await connection.query(
        "UPDATE Events SET title = ?, description = ?, date = ?, location = ? WHERE eventId = ?",
        [title, description, date, location, eventId]
      );
      connection.release();
      return true;
    } catch (error) {
      console.error("Error updating event:", error);
      throw new Error("Database error");
    }
  },

  // Delete event
  deleteEvent: async (eventId) => {
    try {
      const connection = await pool.getConnection();
      await connection.query("DELETE FROM Events WHERE eventId = ?", [eventId]);
      connection.release();
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw new Error("Database error");
    }
  },
};

export default Event;
