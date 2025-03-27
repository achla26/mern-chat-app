import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

function ChatAreaPlaceholder() {
  return (
    <main className="flex-1 flex flex-col min-w-0 w-full bg-background">
      {/* Header Placeholder */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center ml-12 lg:ml-0 gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Messages Placeholder */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] space-y-2`}>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className={`h-${Math.floor(Math.random() * 2 + 2) * 4} w-${Math.floor(Math.random() * 3 + 8) * 16}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Input Placeholder */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Skeleton className="flex-1 h-9" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </main>
  );
}

export default ChatAreaPlaceholder;