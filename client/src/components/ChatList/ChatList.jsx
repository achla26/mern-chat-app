import ChatItem from "@/components/ChatList/ChatItem";
import { getUserChatsThunk } from "@/redux/thunks/chat.thunk";
import React, { memo, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatListPlaceholder from "@/components/Placeholders/ChatListPlaceholder";

const ChatList = memo(() => {
  const dispatch = useDispatch();

  const { chats, chatListComponentLoading } = useSelector(
    (state) => state.chat
  );

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
        toast.error(`An error occurred. ${err}`);
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
        <ChatItem chat={chat} />
      ))}
    </div>
  );
});

export default ChatList;
