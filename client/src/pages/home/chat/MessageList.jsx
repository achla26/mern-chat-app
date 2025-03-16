import React from 'react';

function MessageList({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-lg p-3 ${
              msg.sender === 'You'
                ? 'bg-blue-600'
                : 'bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{msg.sender}</span>
              <span className="text-xs text-gray-400">{msg.timestamp}</span>
            </div>
            <p className="break-words">{msg.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;