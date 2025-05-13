"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ChatSidebar } from "./chat-sidebar";
import { cn } from "@/lib/utils";

type ChatSidebarContextType = {
  collapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
};

const ChatSidebarContext = createContext<ChatSidebarContextType | undefined>(
  undefined
);

export function useChatSidebar() {
  const context = useContext(ChatSidebarContext);
  if (!context) {
    throw new Error("useChatSidebar must be used within a ChatSidebarProvider");
  }
  return context;
}

export function ChatSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  // Store collapse state in localStorage
  useEffect(() => {
    const storedCollapsed = localStorage.getItem("chatSidebarCollapsed");
    if (storedCollapsed !== null) {
      setCollapsed(storedCollapsed === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem("chatSidebarCollapsed", String(newCollapsed));
  };

  const setSidebarCollapsed = (value: boolean) => {
    setCollapsed(value);
    localStorage.setItem("chatSidebarCollapsed", String(value));
  };

  return (
    <ChatSidebarContext.Provider
      value={{
        collapsed,
        toggleSidebar,
        setSidebarCollapsed,
      }}
    >
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />
        <div className={cn("flex-1 overflow-auto")}>{children}</div>
      </div>
    </ChatSidebarContext.Provider>
  );
} 