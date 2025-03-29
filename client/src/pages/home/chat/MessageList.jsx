import { formatTimestamp } from "@/utility/helper";
import { useSelector } from "react-redux";
import ChatAreaPlaceholder from "./ChatAreaPlaceholder";
import { useEffect, useRef } from "react";

function MessageList({ messages, chatAreaComponentLoading }) {
  const MessageRef = useRef(null);

  useEffect(() => {
    if (MessageRef.current) {
      MessageRef.current.scrollTop = MessageRef.current.scrollHeight;
    }
  }, [messages]); // Re-scroll when messages change

  const messageArray = Array.isArray(messages)
    ? messages
    : messages?.data || messages?.messages || [];

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id;

  if (chatAreaComponentLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <ChatAreaPlaceholder />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={MessageRef}>
      {messageArray.length > 0 ? (
        messageArray.map((msg) => {
          const isCurrentUser =
            msg.senderId?.id === currentUserId || msg.sender === currentUserId;
          const senderName =
            msg.senderId?.fullName || msg.senderName || "Unknown";
          const receiverName =
            msg.receiverId?.fullName || msg.receiverName || "Unknown";
          const messageTime = msg.createdAt
            ? formatTimestamp(msg.createdAt)
            : "Just now";

          return (
            <div
              key={
                msg._id || msg.id || Math.random().toString(36).substring(2, 9)
              }
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-lg p-3 ${
                  isCurrentUser
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">
                    {isCurrentUser ? "You" : senderName}
                  </span>
                  <span className="text-xs opacity-80">{messageTime}</span>
                </div>
                <p className="break-words whitespace-pre-wrap">
                  {msg.message || msg.content}
                </p>
                {!isCurrentUser && receiverName && (
                  <p className="text-xs opacity-70 mt-1">To: {receiverName}</p>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-400">No messages yet</p>
        </div>
      )}
    </div>
  );
}

export default MessageList;
