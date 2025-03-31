import React, { useEffect, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "@/components/Sidebar/Sidebar";
import ChatArea from "@/components/chat/ChatArea";
import ChatList from "@/components/ChatList/ChatList";
import ChatHeader from "@/components/ChatList/ChatListHeader";
import SearchBar from "@/components/ChatList/SearchBar";
import { initializeSocket } from "@/redux/socketManager";
import { getUserMessagesThunk } from "@/redux/thunks/chat.thunk";
import { setSelectedChatId } from "@/redux/slices/chat.slice";

const Chat = () => {
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    initializeSocket(dispatch);
  }, [dispatch]);

  const { chatAreaComponentLoading, messages, selectedChatId } = useSelector(
    (state) => state.chat
  );

  // ✅ Fetch messages when selectedChatId is set (e.g., after reload)
  useEffect(() => {
    if (selectedChatId) { 
      dispatch(getUserMessagesThunk({ conversationId: selectedChatId }));
    }
  }, [dispatch, selectedChatId]);

  // ✅ Prevent multiple fetch calls & handle chat selection
  const handleUserClick = useCallback(
    (conversationId) => {
      if (selectedChatId === conversationId) return; // Prevent duplicate fetch
      dispatch(setSelectedChatId(conversationId)); // Set the new chat
    },
    [dispatch, selectedChatId]
  );

  const handleSendMessage = useCallback(
    (msg) => {
      if (msg.trim() && selectedChatId) {
        dispatch(getUserMessagesThunk({ recieverId: selectedChatId, message: msg }));
        console.log("Message sent:", msg);
      }
    },
    [dispatch, selectedChatId]
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900 text-gray-100">
      <div className="flex h-full">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-full hover:bg-gray-700"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-[280px] flex-shrink-0 flex flex-col border-r border-gray-700 
          transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 bg-gray-900`}
        >
          <div className="p-4 border-b border-gray-700">
            <ChatHeader />
            <SearchBar />
          </div>
          <ChatList selectedChatId={selectedChatId} handleUserClick={handleUserClick} />
        </aside>

        <ChatArea messages={messages} handleSendMessage={handleSendMessage} chatAreaComponentLoading={chatAreaComponentLoading} />
      </div>
    </div>
  );
};

export default Chat;
