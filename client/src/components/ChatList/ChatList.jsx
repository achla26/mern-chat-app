import ChatItem from "@/components/ChatList/ChatItem";
import { getUserChatsThunk } from "@/redux/thunks/chat.thunk";
import React, { memo, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatListPlaceholder from "@/components/Placeholders/ChatListPlaceholder";
import { setSelectedChatId } from "@/redux/slices/chat.slice";

const ChatList = memo(({ selectedChatId , handleUserClick}) => {
  const dispatch = useDispatch();

  const { chats, chatListComponentLoading } = useSelector((state) => state.chat);

  const chatsArray = useMemo(
    () =>
      chats && typeof chats === "object" && !Array.isArray(chats)
        ? Object.values(chats)
        : Array.isArray(chats)
        ? chats
        : [],
    [chats]
  );

  useEffect(() => {
    const fetchChats = async () => {
      try {
        await dispatch(getUserChatsThunk());
      } catch (err) {
        console.error("An error occurred while fetching chats:", err);
      }
    };

    fetchChats();
  }, [dispatch]);
 
  
  if (chatListComponentLoading) {
    return <ChatListPlaceholder />;
  }

  if (chatsArray.length === 0) {
    return (
      <div className="w-[25%] p-4 text-gray-400">
        <p>No chats available</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chatsArray.map((chat) => (
        <ChatItem
          key={chat._id}
          chat={chat}
          selectedChatId={selectedChatId}
          handleUserClick={handleUserClick}
        />
      ))}
    </div>
  );
});

export default ChatList;
