import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './sidebar/Sidebar'; 
import ChatArea from './chat/ChatArea';

function Home() {
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const chats = [
    { id: 1, name: "Team Project", lastMessage: "Great work everyone!", timestamp: "10:30 AM", unread: 2 },
    { id: 2, name: "Design Discussion", lastMessage: "Let's review the mockups", timestamp: "9:15 AM", unread: 0 },
    { id: 3, name: "Marketing Team", lastMessage: "Campaign updates", timestamp: "Yesterday", unread: 5 },
  ];

  const messages = [
    { id: 1, content: "Hi there! How's the project going?", sender: "John", timestamp: "10:30 AM" },
    { id: 2, content: "It's going well! We're making good progress.", sender: "You", timestamp: "10:31 AM" },
    { id: 3, content: "That's great to hear! Any blockers?", sender: "John", timestamp: "10:32 AM" },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle sending message
      setMessage('');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900 text-gray-100">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-full hover:bg-gray-700"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex h-full">
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          chats={chats}
        />
        <ChatArea 
          messages={messages}
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default Home;