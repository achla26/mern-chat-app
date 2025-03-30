import React, { memo , useCallback , useEffect } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import { useSelector , useDispatch } from "react-redux";
import { getUserMessagesThunk } from "@/redux/thunks/chat.thunk";

const ChatArea = memo(() => {

  const dispatch = useDispatch();
  
  const { chatAreaComponentLoading, messages,selectedChatId } = useSelector(
    (state) => state.chat
  );

  const handleSendMessage = useCallback(
    (msg) => {
      if (msg.trim()) {
        dispatch(
          getUserMessagesThunk({
            recieverId: selectedChatId,
            message: msg,
          })
        );
      }
    },
    [dispatch, selectedChatId]
  );

  //  useEffect(() => {
  //     if (selectedChatId) {  
  //       dispatch(getUserMessagesThunk({ conversationId: selectedChatId }));
  //     }
  //   }, [selectedChatId, dispatch]);
  return (
    <main className="flex-1 flex flex-col min-w-0 w-full">
      <ChatHeader />
      <MessageList
        messages={messages}
        chatAreaComponentLoading={chatAreaComponentLoading}
      />
      <MessageInput onSendMessage={handleSendMessage} />
    </main>
  );
});

export default ChatArea;
