"use client";

import { ChatSidebarProvider } from "@/components/chat/chat-sidebar-provider";
import { cn } from "@/lib/utils";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebarProvider>
          {children}
        </ChatSidebarProvider>
      </div>
    </div>
  );
} 