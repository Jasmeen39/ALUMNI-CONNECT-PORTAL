import { useEffect, useState, useRef } from "react";
import moment from "moment"; // For formatting timestamps
import { useApi } from "@/hooks/useApi";

const Chat = ({ userId, receiver, onClose, refreshMessages }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const chatContainerRef = useRef(null);
  const api = useApi();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [receiver]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    if (!receiver || !receiver.userId) return;

    try {
      const response = await api.get(`/api/messages/${receiver.userId}`);
      if (response.data) {
        setMessages(
          response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !receiver?.userId) return;

    setError("");
    const messageData = {
      receiverId: receiver.userId,
      content: newMessage.trim()
    };

    try {
      const response = await api.post('/api/messages', messageData);
      if (response.data) {
        // Add the new message to the local state
        const newMessageObj = {
          messageId: response.data.messageId,
          senderId: userId,
          receiverId: receiver.userId,
          content: newMessage.trim(),
          timestamp: new Date().toISOString()
        };
        
        setMessages((prevMessages) => [...prevMessages, newMessageObj].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        ));
        setNewMessage("");
        refreshMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error.response?.data?.message || "Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center border-b p-3">
        <h2 className="text-lg font-semibold text-maroon">
          Chat with {receiver?.firstName} {receiver?.lastName}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
          &times;
        </button>
      </div>

      {/* Messages (Scrollable Panel) */}
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-3 space-y-2">
        {messages.length > 0 ? (
          messages.reduce((acc, msg, index) => {
            const messageDate = moment(msg.timestamp).format("DD MMM YYYY");
            const prevDate =
              index > 0 ? moment(messages[index - 1].timestamp).format("DD MMM YYYY") : null;
          
            // Add date separator when date changes
            if (messageDate !== prevDate) {
              acc.push(
                <div key={`date-${index}`} className="text-center text-gray-500 text-xs my-2">
                  {messageDate}
                </div>
              );
            }
          
            // Message bubble
            acc.push(
              <div key={msg.messageId} className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                <div
                  className={`p-3 rounded-lg shadow-md max-w-xs break-words relative ${
                    msg.senderId === userId ? "bg-maroon text-white" : "bg-gray-300 text-black"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-gray-400 text-right mt-1">
                    {msg.timestamp ? moment(msg.timestamp).format("hh:mm A") : ""}
                  </p>
                </div>
              </div>
            );
          
            return acc;
          }, [])
        ) : (
          <p className="text-gray-500">No messages yet.</p>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="px-3 py-2 text-red-500 text-sm">
          {error}
        </div>
      )}
      
      {/* Input Field */}
      <div className="border-t flex p-3">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l-md focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
        />
        <button 
          onClick={sendMessage} 
          className="bg-maroon text-white px-4 rounded-r-md hover:bg-maroon-600"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
