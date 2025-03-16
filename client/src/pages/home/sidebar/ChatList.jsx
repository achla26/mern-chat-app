import React from 'react';

function ChatList({ chats, onChatSelect }) {
  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="flex items-center p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700 transition-colors"
          onClick={() => onChatSelect()}
        >
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold truncate">{chat.name}</h3>
              <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{chat.timestamp}</span>
            </div>
            <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
          </div>
          {chat.unread > 0 && (
            <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs flex-shrink-0">
              {chat.unread}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default ChatList;