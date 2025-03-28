import Spinner from "@/Spinner";
import { formatTimestamp } from "@/utility/helper";
import React, { memo, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserMessagesThunk } from "@/redux/thunks/chat.thunk";
import SidebarPlaceholder from "./SidebarPlaceholder";
import { setSelectedChatId } from "@/redux/slices/chat.slice";

const ChatList = memo(({ chats, chatListComponentLoading }) => {
  const dispatch = useDispatch();
  const { selectedChatId } = useSelector((state) => state.chat);

  // Convert chats object to array if needed
  const chatsArray = chats && typeof chats === 'object' && !Array.isArray(chats)
    ? Object.values(chats)
    : Array.isArray(chats) 
      ? chats 
      : [];

  const fetchMessages = useCallback((chatId) => {
    dispatch(getUserMessagesThunk({ chatId }));
  }, [dispatch]);

  const handleUserClick = useCallback((chatId) => {
    dispatch(setSelectedChatId(chatId));
    fetchMessages(chatId);
  }, [dispatch, fetchMessages]);

  useEffect(() => { 
    if (selectedChatId) {
      fetchMessages(selectedChatId);
    }
  }, [selectedChatId, fetchMessages]);

  const generateAvatarUrl = (chat) => {
    const name = encodeURIComponent(chat.chatName || "Chat");
    return chat.avatar || `https://ui-avatars.com/api/?name=${name}&background=random`;
  };

  if (chatListComponentLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <SidebarPlaceholder />
      </div>
    );
  }

  if (chatsArray.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-gray-400">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-lg">No conversations yet</p>
        <p className="text-sm">Start a new chat to see it here</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto" role="list">
      {chatsArray.map((chat) => {
        const avatarUrl = generateAvatarUrl(chat);
        const isSelected = selectedChatId === chat._id;

        return (
          <div
            key={chat._id}
            role="listitem"
            aria-selected={isSelected}
            className={`flex items-center p-4 cursor-pointer border-b border-gray-700 transition-colors ${
              isSelected ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
            onClick={() => handleUserClick(chat._id)}
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 mr-3">
              <img
                src={avatarUrl}
                alt={`Avatar for ${chat.chatName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    chat.chatName || "U"
                  )}&background=random`;
                }}
                loading="lazy"
              />
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold truncate" title={chat.chatName}>
                  {chat.chatName}
                </h3>
                <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                  {formatTimestamp(chat.updatedAt || chat.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-400 truncate" title={chat.lastMessage}>
                {chat.lastMessage || "No messages yet"}
              </p>
            </div>
            {chat.unreadCount > 0 && (
              <span 
                className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs flex-shrink-0"
                aria-label={`${chat.unreadCount} unread messages`}
              >
                {chat.unreadCount}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});

export default ChatList;