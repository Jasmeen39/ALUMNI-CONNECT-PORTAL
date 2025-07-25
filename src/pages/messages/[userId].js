import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";

const MessagesPage = () => {
  const router = useRouter();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(`/api/messages/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Error fetching chats:", await response.json());
        return;
      }

      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const openChat = (chatUserId) => {
    router.push(`/chat/${chatUserId}`);
  };

  return (
    <div className="h-screen flex flex-col bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="border-b p-3 text-xl font-semibold text-maroon">
        Messages
      </div>

      {/* Chat List */}
      <div className="flex-grow overflow-y-auto p-3 space-y-2">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.userId}
              className="p-3 border-b cursor-pointer flex items-center justify-between hover:bg-gray-100 rounded-lg"
              onClick={() => openChat(chat.userId)}
            >
              <div>
                <p className={`text-lg ${chat.unreadCount > 0 ? "font-bold" : "font-normal"}`}>
                  {chat.firstName} {chat.lastName}
                </p>
                <p className="text-sm text-gray-600 truncate max-w-xs">
                  {chat.lastMessage || "No messages yet"}
                </p>
              </div>
              <div className="text-xs text-gray-500">
                {chat.lastMessageTime ? moment(chat.lastMessageTime).format("hh:mm A") : ""}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No chats available.</p>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
