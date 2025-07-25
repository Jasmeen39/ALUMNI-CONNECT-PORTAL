import React from "react";
import moment from "moment";
import { useUser } from "@/hooks/useUser";

const MessageCard = ({ messages, onClick }) => {
  const { user: currentUser } = useUser();

  if (!messages || messages.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">No messages yet.</div>
    );
  }

  // Get last read timestamps from localStorage
  const readTimestamps = JSON.parse(localStorage.getItem("readTimestamps") || "{}");

  return (
    <div className="space-y-3">
      {messages.map((message) => {
        // Check if the message is unread
        const lastSeen = readTimestamps?.[message.userId];
        const isUnread =
          message.lastMessageTime &&
          (!lastSeen || new Date(message.lastMessageTime) > new Date(lastSeen)) &&
          message.lastMessageSenderId !== currentUser?.userId; // Only mark as unread if not from current user

        return (
          <div
            key={message.userId}
            className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
            onClick={() => {
              // Update last read timestamp for this user
              const updatedTimestamps = { ...readTimestamps, [message.userId]: new Date().toISOString() };
              localStorage.setItem("readTimestamps", JSON.stringify(updatedTimestamps));

              onClick?.(message); // 🔥 Open chat
            }}
          >
            {/* Initials */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-700 font-semibold uppercase">
              {message.firstName && message.lastName
                ? `${message.firstName[0]}${message.lastName[0]}`
                : "?"}
            </div>

            {/* Message Content */}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className={`text-gray-900 ${isUnread ? "font-bold" : "font-semibold"}`}>
                  {message.firstName} {message.lastName}
                </p>
                <span className="text-xs text-gray-500">
                  {message.lastMessageTime
                    ? moment(message.lastMessageTime).format("MMM D, YYYY h:mm A")
                    : ""}
                </span>
              </div>
              <p className={`text-sm mt-1 truncate max-w-sm ${isUnread ? "font-bold text-black" : "text-gray-700"}`}>
                {message.lastMessage || "No messages yet."}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageCard;
