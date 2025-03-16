import React from 'react';
import { MessageSquare, Search, Settings } from 'lucide-react';

function ChatHeader() {
  return (
    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
      <div className="flex items-center ml-12 lg:ml-0 min-w-0">
        <MessageSquare className="mr-2 flex-shrink-0" />
        <h2 className="text-lg font-semibold truncate">Team Project</h2>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <Search size={20} />
        </button>
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;