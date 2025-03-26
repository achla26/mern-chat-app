import { formatTimestamp } from "@/utility/helper";
import { useSelector } from "react-redux";

function MessageList({ messages }) {
  const messageArray = Array.isArray(messages)
    ? messages
    : messages?.data || messages?.messages || [];

  const currentUser = useSelector((state) => state.auth.user);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {Array.isArray(messageArray) ? (
        messageArray.map((msg) => {
          const isCurrentUser = msg.senderId?.id === currentUser.id;

          return (
            <div
              key={msg._id}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-lg p-3 ${
                  isCurrentUser ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">
                    {isCurrentUser ? "You" : senderName}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="break-words">{msg.message}</p>
                {!isCurrentUser && (
                  <p className="text-xs text-gray-300 mt-1">
                    To: {receiverName}
                  </p>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex justify-center items-center h-full">
          <p>No chats available</p>
        </div>
      )}
    </div>
  );
}

export default MessageList;
