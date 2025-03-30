import React, { useState, useCallback } from "react";
import { Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageThunk } from "@/redux/thunks/chat.thunk";
import { addNewMessage } from "@/redux/slices/chat.slice";
import { userData } from "@/utility/helper";

const MessageInput = React.memo(() => {
  const { selectedChatId, otherParticipants } = useSelector(
    (state) => state.chat
  );
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");

  const handleInputChange = useCallback((e) => {
    setMessage(e.target.value);
  }, []);

  const handleSendMessage = useCallback(
    (e) => {
      e.preventDefault(); 
      if (!selectedChatId) {
        toast.error(
          "No chat selected. Please select a chat to send a message."
        );
        return;
      }
      if (message.trim()) {
        const newMessage = {
          conversationId: selectedChatId,
          message: message.trim(),
          senderId: userData?._id, // Replace with actual current user ID
          createdAt: new Date().toISOString(),
        };

        dispatch(addNewMessage(newMessage)); // Add the new message to the Redux store

        dispatch(
          sendMessageThunk({
            conversationId: selectedChatId,
            receiverIds: otherParticipants,
            message: message.trim(),
          })
        );
        setMessage("");
      }
    },
    [message]
  );

  return (
    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
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
});

export default MessageInput;
