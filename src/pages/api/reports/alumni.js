import db from "@/lib/db";
import authMiddleware from "@/middleware/auth.middleware";

export default async function handler(req, res) {
  authMiddleware(["admin"])(req, res, async () => {
    if (req.method === "GET") {
      try {
        const [results] = await db.query(
          `SELECT 
              Users.userId, Users.firstName, Users.lastName, Users.email, Users.graduationYear,
              COUNT(DISTINCT Posts.postId) AS postsCreated,
              COUNT(DISTINCT Messages.messageId) AS messagesSent,
              COUNT(DISTINCT Events.eventId) AS eventsOrganized
           FROM Users
           LEFT JOIN Posts ON Users.userId = Posts.userId
           LEFT JOIN Messages ON Users.userId = Messages.senderId
           LEFT JOIN Events ON Users.userId = Events.organizerId
           WHERE Users.role = 'alumni'
           GROUP BY Users.userId`
        );
        return res.status(200).json(results);
      } catch (error) {
        console.error("Error generating alumni report:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
    return res.status(405).json({ message: "Method Not Allowed" });
  });
}
