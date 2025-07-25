import { createContext, useContext, useState, useEffect } from 'react'; // ✅ Fixes the issue
import axios from 'axios';

const MessageContext = createContext(); // ✅ Now createContext is defined

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Fetch messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get('/messages');
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error.response?.data || error);
      }
      setLoading(false);
    };

    fetchMessages();
  }, []);

  // Add a new message
  const addMessage = async (messageData) => {
    try {
      const response = await api.post('/messages', messageData);
      setMessages((prevMessages) => [...prevMessages, response.data]);
    } catch (error) {
      console.error('Error adding message:', error.response?.data || error);
      throw new Error('Failed to send message');
    }
  };

  return (
    <MessageContext.Provider value={{ messages, loading, addMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
export { MessageContext };
