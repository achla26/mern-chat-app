import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

function ChatListPlaceholder() {
  return (
    <aside className="w-[280px] flex-shrink-0 flex flex-col border-r border-border bg-background">
      {/* Header Placeholder */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-9 w-full" />
      </div>

      {/* Chat List Placeholder */}
      <div className="flex-1 overflow-y-auto">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center p-4 border-b border-border">
            <Skeleton className="w-12 h-12 rounded-full flex-shrink-0 mr-3" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        ))}
      </div>

      {/* New Chat Button Placeholder */}
      <div className="p-4">
        <Skeleton className="h-10 w-full" />
      </div>
    </aside>
  );
}

export default ChatListPlaceholder;
