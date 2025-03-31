import React, { memo } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";

const ChatArea = memo(({messages, handleSendMessage, chatAreaComponentLoading}) => { 
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
