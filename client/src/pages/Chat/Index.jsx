import React, { useEffect, useState, useCallback, Suspense, lazy } from "react";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { debounce } from "lodash";
import { initializeSocket } from "@/redux/socketManager";
import { getUserMessagesThunk } from "@/redux/thunks/chat.thunk";
import { setSelectedChatId } from "@/redux/slices/chat.slice";

const ChatArea = lazy(() => import('@/components/chat/ChatArea'));
const ChatList = lazy(() => import('@/components/ChatList/ChatList'));
const ChatHeader = lazy(() => import('@/components/ChatList/ChatListHeader'));
const SearchBar = lazy(() => import('@/components/ChatList/SearchBar'));

const Chat = () => {
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    initializeSocket(dispatch);

    return () => {
      // Cleanup socket connection when component unmounts
    };
  }, [dispatch]);

  const { chatAreaComponentLoading, messages, selectedChatId } = useSelector(
    (state) => state.chat
  );

  const fetchMessages = useCallback(
    debounce((id) => {
      dispatch(getUserMessagesThunk({ conversationId: id }));
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
    }
  }, [dispatch, selectedChatId, fetchMessages]);

  const handleUserClick = useCallback(
    (conversationId) => {
      if (selectedChatId === conversationId) return;
      dispatch(setSelectedChatId(conversationId));
    },
    [dispatch, selectedChatId]
  );

  const handleSendMessage = useCallback(
    (msg) => {
      if (msg.trim() && selectedChatId) {
        dispatch(getUserMessagesThunk({ recieverId: selectedChatId, message: msg }));
      }
    },
    [dispatch, selectedChatId]
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900 text-gray-100">
      <Suspense fallback={<div>Loading...</div>}> 
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
      </Suspense>
    </div>
  );
};

export default Chat;
