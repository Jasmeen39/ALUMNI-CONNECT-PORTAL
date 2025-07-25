import { useApi } from "@/hooks/useApi";

// ✅ Send a new message
export const sendMessage = async (messageData) => {
  try {
    const api = useApi();
    const response = await api.post("/api/messages", messageData);
    return response.data;
  } catch (error) {
    console.error("Message send error:", error);
    throw new Error(error.response?.data?.message || "Failed to send message.");
  }
};

// ✅ Get messages for a specific conversation
export const getMessages = async (userId) => {
  try {
    const api = useApi();
    const response = await api.get(`/api/messages/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Messages fetch error:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch messages.");
  }
};

// ✅ Get all conversations
export const getConversations = async () => {
  try {
    const api = useApi();
    const response = await api.get("/api/messages/conversations");
    return response.data;
  } catch (error) {
    console.error("Conversations fetch error:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch conversations.");
  }
};

// ✅ Delete a message
export const deleteMessage = async (messageId) => {
  try {
    const api = useApi();
    const response = await api.delete(`/api/messages/${messageId}`);
    return response.data;
  } catch (error) {
    console.error("Message deletion error:", error);
    throw new Error(error.response?.data?.message || "Failed to delete message.");
  }
};

// ✅ Mark message as read
export const markMessageAsRead = async (messageId) => {
  try {
    const api = useApi();
    const response = await api.put(`/api/messages/${messageId}/read`);
    return response.data;
  } catch (error) {
    console.error("Message read status update error:", error);
    throw new Error(error.response?.data?.message || "Failed to mark message as read.");
  }
};

// ✅ Get unread message count
export const getUnreadCount = async () => {
  try {
    const api = useApi();
    const response = await api.get("/api/messages/unread/count");
    return response.data;
  } catch (error) {
    console.error("Unread count fetch error:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch unread count.");
  }
};
