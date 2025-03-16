import React from 'react';
import { Send } from 'lucide-react';

function MessageInput({ message, setMessage, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="p-4 border-t border-gray-700">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-800 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full flex-shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!message.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}

export default MessageInput;