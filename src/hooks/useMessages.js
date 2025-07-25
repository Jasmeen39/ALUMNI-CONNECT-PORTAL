import { useEffect, useState, useRef } from "react";
import { useApi } from "./useApi";
import { useUser } from "./useUser"; // ✅ Get logged-in user info

export const useMessages = () => {
  const { user } = useUser(); // ✅ Get logged-in user
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = useApi();
  const isMountedRef = useRef(true);
  const lastFetchTimeRef = useRef(0);

  const fetchMessages = async () => {
    if (!user?.userId) return;

    // Prevent rapid refetches (minimum 2 seconds between fetches)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 2000) {
      return;
    }
    lastFetchTimeRef.current = now;

    setLoading(true);
    try {
      const response = await api.get(`/api/messages/all`);

      if (!isMountedRef.current) return;

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("No messages received");
      }

      setMessages(response.data);
      setError(null);
    } catch (err) {
      if (!isMountedRef.current) return;

      // Don't set error for canceled requests
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        setError(err.message || "Failed to fetch messages");
        console.error("Fetch error:", err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchMessages();

    // Set up interval for refreshing messages
    const intervalId = setInterval(fetchMessages, 5000);

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [user?.userId]);

  return { messages, fetchMessages, loading, error };
};
