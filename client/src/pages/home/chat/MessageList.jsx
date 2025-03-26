import { formatTimestamp } from "@/utility/helper";

function MessageList({ messages }) {
  const messageArray = Array.isArray(messages)
    ? messages
    : messages?.data || messages?.messages || [];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {Array.isArray(messageArray) ? (
        messageArray.map((msg) => {
          // Determine if the message is from the current user
          // const isCurrentUser = msg.senderId?._id === currentUserId;
          // const senderName = isCurrentUser ? "You" : msg.senderId?.email?.split("@")[0];
          // const receiverName = msg.receiverIds?.[0]?.email?.split("@")[0];
          return (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-lg p-3 ${
                  msg.sender === "You" ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{msg.sender}</span>
                  <span className="text-xs text-gray-400">
                    {formatTimestamp(msg.createdAt)}
                  </span>
                </div>
                <p className="break-words">{msg.message}</p>
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
