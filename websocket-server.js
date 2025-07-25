const WebSocket = require("ws");
const db = require("./src/lib/db"); // Ensure correct DB import

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map();

wss.on("connection", (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    ws.close();
    return;
  }

  clients.set(userId, ws); // Store user's connection

  ws.on("message", async (message) => {
    try {
      const { senderId, receiverId, content } = JSON.parse(message);

      // Ensure receiverId is an integer
      const parsedReceiverId = parseInt(receiverId, 10);
      if (isNaN(parsedReceiverId)) throw new Error("Invalid receiverId");

      // Save message to the database (Ensure table name is correct: 'messages')
      await db.query(
        "INSERT INTO messages (senderId, receiverId, content) VALUES (?, ?, ?)",
        [senderId, parsedReceiverId, content]
      );

      // Forward message if receiver is online
      if (clients.has(receiverId)) {
        clients.get(receiverId).send(JSON.stringify({ senderId, content }));
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  ws.on("close", () => {
    clients.delete(userId);
  });
});

console.log("✅ WebSocket server running on ws://localhost:8080");
