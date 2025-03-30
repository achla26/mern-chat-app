import Spinner from "@/Spinner";
import { formatTimestamp } from "@/utility/helper";
import React, { memo, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserMessagesThunk } from "@/redux/thunks/chat.thunk";
import SidebarPlaceholder from "./SidebarPlaceholder";
import { setSelectedChatId } from "@/redux/slices/chat.slice";
import { getOtherParticipant } from "@/utility/helper";

const ChatList = memo(({ chats, chatListComponentLoading }) => {
  const dispatch = useDispatch();
  const { selectedChatId } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.socket);

  const onlineUsersSet = new Set(onlineUsers);

  const chatsArray = useMemo(
    () =>
      chats && typeof chats === "object" && !Array.isArray(chats)
        ? Object.values(chats)
        : Array.isArray(chats)
        ? chats
        : [],
    [chats]
  ); 
  const fetchMessages = useCallback(
    (conversationId) => {
      dispatch(getUserMessagesThunk({ conversationId }));
    },
    [dispatch]
  );

  const handleUserClick = useCallback(
    (conversationId) => {
      dispatch(setSelectedChatId(conversationId));
      fetchMessages(conversationId);
    },
    [dispatch, fetchMessages]
  );

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
    }
  }, [selectedChatId, fetchMessages]);

  const generateAvatarUrl = useCallback((chat) => {
    const name = encodeURIComponent(chat.chatName || "Chat");
    return (
      chat.avatar ||
      `https://ui-avatars.com/api/?name=${name}&background=random`
    );
  }, []);

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
        <svg
          className="w-12 h-12 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75h.008v.008h-.008v-.008zM14.25 9.75h.008v.008h-.008v-.008zM7.5 16.5h9m-7.5 3h6a6 6 0 100-12h-6a6 6 0 100 12z"
          ></path>
        </svg>
        <p>No chats available</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chatsArray.map((chat) => (
        <div
          key={chat._id}
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
      ))}
    </div>
  );
});

export default ChatList;
