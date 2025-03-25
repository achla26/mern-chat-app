import Spinner from "@/Spinner";
import { formatTimestamp } from "@/utility/helper";
function ChatList({ chats, onChatSelect, chatComponentLoading }) {
  // console.log(object)
  return (
    <div className="flex-1 overflow-y-auto">
      {chatComponentLoading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner /> {/* Replace with your loading component */}
        </div>
      ) : Array.isArray(chats) ? (
        chats.map((chat) => {
          const avatar =
            chat.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              chat.chatName || ""
            )}&background=random`;

          return (
            <div
              key={chat._id}
              className="flex items-center p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700 transition-colors"
              onClick={() => onChatSelect(chat._id)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 mr-3">
                <img
                  src={avatar}
                  alt={chat.chatName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      chat.chatName
                    )}&background=random`;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold truncate">{chat.chatName}</h3>
                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                    {chat.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate">
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread > 0 && (
                <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs flex-shrink-0">
                  {chat.unread}
                </span>
              )}
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
export default ChatList;
