import React, { useCallback } from "react";
import { getOtherParticipant } from "@/utility/helper";
import { useSelector } from "react-redux";

const ChatItem = ({ chat, selectedChatId, handleUserClick }) => {
  const { onlineUsers } = useSelector((state) => state.socket);
  const onlineUsersSet = new Set(onlineUsers);

  const generateAvatarUrl = useCallback((chat) => {
    const name = encodeURIComponent(chat.chatName || "Chat");
    return chat.avatar || `https://ui-avatars.com/api/?name=${name}&background=random`;
  }, []);

  return (
    <div
      className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-800 ${
        selectedChatId === chat._id ? "bg-gray-800" : ""
      }`}
      onClick={() => handleUserClick(chat._id)}
    >
      <img
        src={generateAvatarUrl(chat)}
        alt={chat.chatName || "Chat"}
        className="w-12 h-12 rounded-full"
      />
      <div className="flex-1">
        <p className="text-white font-medium">
          {getOtherParticipant(chat.participants)?.name || chat.chatName}
        </p>
        <p className="text-sm text-gray-400 truncate">
          {chat.lastMessage || "No messages yet"}
        </p>
      </div>
      {onlineUsersSet.has(getOtherParticipant(chat.participants)?._id) && (
        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
      )}
    </div>
  );
};

export default ChatItem;
