import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatArea({ messages, message, setMessage, handleSendMessage }) {
  return (
    <main className="flex-1 flex flex-col min-w-0 w-full">
      <ChatHeader />
      <MessageList messages={messages} />
      <MessageInput 
        message={message}
        setMessage={setMessage}
        onSubmit={handleSendMessage}
      />
    </main>
  );
}

export default ChatArea;