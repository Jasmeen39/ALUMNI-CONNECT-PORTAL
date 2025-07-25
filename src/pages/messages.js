import React from 'react';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageCard';
import { useMessages } from '../hooks/useMessages'; // Ensure correct hook usage

const MessagesPage = () => {
  const { messages } = useMessages(); // Fetch messages from context or API

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold text-maroon border-b-2 border-maroon pb-2 mb-6">
            Messages
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <MessageList messages={messages} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MessagesPage;
