import React, { useCallback, useEffect } from "react";
import { getOtherParticipant } from "@/utility/helper";
import { setSelectedChatId } from "@/redux/slices/chat.slice";
import { useDispatch, useSelector } from "react-redux";
import { getUserMessagesThunk } from "@/redux/thunks/chat.thunk";

const ChatItem = ({ chat }) => {
  const dispatch = useDispatch();

  const { selectedChatId } = useSelector((state) => state.chat);

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

  const { onlineUsers } = useSelector((state) => state.socket);

  const onlineUsersSet = new Set(onlineUsers);
  const generateAvatarUrl = useCallback((chat) => {
    const name = encodeURIComponent(chat.chatName || "Chat");
    return (
      chat.avatar ||
      `https://ui-avatars.com/api/?name=${name}&background=random`
    );
  }, []);
  return (
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
  );
};
export default ChatItem;
