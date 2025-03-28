import React from 'react';
import { Send } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessageThunk
} from "@/redux/thunks/chat.thunk";

import { useState } from "react";


function MessageInput() {
const { 
    selectedChatId, 
  } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const { selectedUser , otherParticipants } = useSelector((state) => state.chat);
  const [message, setMessage] = useState("");
  const { user } = useSelector(state => state.user); 
  const handleSendMessage = (e) => {
    e.preventDefault();

    dispatch(
      sendMessageThunk({
        receiverIds: otherParticipants, 
        message,
      })
    );
    setMessage('');
  };

  return (
    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-800 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          type="button"
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full flex-shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!message} 
          onClick={handleSendMessage}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}

export default MessageInput;