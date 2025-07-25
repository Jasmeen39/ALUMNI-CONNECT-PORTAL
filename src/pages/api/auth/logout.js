export default function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    // Invalidate token on client-side (handled via localStorage/cookies)
    return res.status(200).json({ message: "Logout successful" });
  }
  