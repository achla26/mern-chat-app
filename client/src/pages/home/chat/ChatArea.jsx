import React, { memo } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatArea = memo(({ messages, chatAreaComponentLoading, onSendMessage }) => {
  return (
    <main className="flex-1 flex flex-col min-w-0 w-full">
      <ChatHeader />
      <MessageList
        messages={messages}
        chatAreaComponentLoading={chatAreaComponentLoading}
      /> 
      <MessageInput onSendMessage={onSendMessage} />
    </main>
  );
});

export default ChatArea;