import React, { useEffect, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./sidebar/Sidebar";
import ChatArea from "./chat/ChatArea";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserChatsThunk,
  getUserMessagesThunk,
} from "@/redux/thunks/chat.thunk";
import { logoutUserThunk } from "@/redux/thunks/auth.thunk";
import { toast } from "react-hot-toast";
import { useNavigation } from "../../hooks/navigation";

function Home() {
  const {
    chats,
    chatListComponentLoading,
    chatAreaComponentLoading,
    selectedChatId,
    messages,
  } = useSelector((state) => state.chat);
  const { navigate } = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
 
  // logout functionality

  const logout = useCallback(async () => {
    try {
      const response = await dispatch(logoutUserThunk());
      if (response?.payload?.success) navigate("/login");
    } catch (err) {
      toast.error(`An error occurred. ${err}`);
    }
  }, [dispatch, navigate]);

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

  const currentMessages = selectedChatId ? messages[selectedChatId] : [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      dispatch(
        sendMessageThunk({
          recieverId: selectedUser?._id,
          message: msg,
        })
      );
      setMessage("");
    }
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900 text-gray-100">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-full hover:bg-gray-700"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex h-full">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          chats={chats}
          logout={logout}
          chatListComponentLoading={chatListComponentLoading}
        />
        <ChatArea messages={currentMessages} chatAreaComponentLoading={chatAreaComponentLoading}/>
      </div>
    </div>
  );
}
export default Home;
