import React, { memo } from "react";
import { Settings, Users, Plus } from "lucide-react";

const ChatListHeader = memo(() => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Messages</h1>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
            <Settings size={20} />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
            <Users size={20} />
          </button>
          <button
            onClick={()=>{}}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <Users size={20} />
          </button>
        </div>
      </div>
    </>
  );
});

export default ChatListHeader;
