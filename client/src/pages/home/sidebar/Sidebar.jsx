import React from 'react';
import { Settings, Users, Plus } from 'lucide-react';
import SearchBar from './SearchBar';
import ChatList from './ChatList';

function Sidebar({ isOpen, onClose, chats , logout}) {
  
  return (
    <aside 
      className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-[280px] flex-shrink-0 flex flex-col border-r border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 bg-gray-900
      `}
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
              <Settings size={20} />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
              <Users size={20} />
            </button>
            <button onClick={logout} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
              <Users size={20} />
            </button>
          </div>
        </div>
        <SearchBar />
      </div>

      <ChatList chats={chats} onChatSelect={onClose} />

      <button className="m-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 transition-colors">
        <Plus size={20} />
        <span>New Chat</span>
      </button>
    </aside>
  );
}

export default Sidebar;