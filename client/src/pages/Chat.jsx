import React, { useEffect, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/Sidebar/Sidebar";
import ChatArea from "@/components/chat/ChatArea";
import ChatList from "@/components/ChatList/ChatList";
import { initializeSocket } from "@/redux/socketManager";
import { useDispatch } from "react-redux";
import ChatHeader from "@/components/ChatList/ChatListHeader";
import SearchBar from "@/components/ChatList/SearchBar";
const Chat = () => {
  const dispatch = useDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    initializeSocket(dispatch);
  }, [dispatch]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900 text-gray-100">
      <div className="flex h-full">
        <div>
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <button
            onClick={toggleSidebar}
            className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-full hover:bg-gray-700"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <aside
          className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-[280px] flex-shrink-0 flex flex-col border-r border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 bg-gray-900
      `}
        >
          <div className="p-4 border-b border-gray-700">
            <ChatHeader />
            <SearchBar />
          </div>
          <ChatList />
        </aside>
        <ChatArea />

      </div>
    </div>
  );
};

export default Chat;
