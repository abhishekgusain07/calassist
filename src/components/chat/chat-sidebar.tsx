"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useChatSidebar } from "./chat-sidebar-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, LayoutGrid, MessageSquare, Plus, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { ChatConversationItem } from "./chat-conversation-item";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for conversation history - you'll replace this with actual data fetching
const MOCK_CONVERSATIONS = [
  { id: "1", title: "Meeting schedule for next week", date: new Date(2023, 6, 15), isActive: true },
  { id: "2", title: "Birthday party planning", date: new Date(2023, 6, 10) },
  { id: "3", title: "Vacation planning", date: new Date(2023, 6, 5) },
  { id: "4", title: "Doctor's appointment", date: new Date(2023, 6, 1) },
  { id: "5", title: "Team building event", date: new Date(2023, 5, 28) },
  { id: "6", title: "Conference schedule", date: new Date(2023, 5, 25) },
  { id: "7", title: "Weekend plans", date: new Date(2023, 5, 20) },
  { id: "8", title: "Weekly calendar review", date: new Date(2023, 5, 15) },
];

export function ChatSidebar() {
  const { collapsed, toggleSidebar } = useChatSidebar();

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-muted/5 transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[280px]"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-3 py-2">
        {!collapsed && (
          <Link href="/chat?new=true" className="flex items-center gap-2 font-medium text-purple-800">
            <MessageSquare size={18} className="text-purple-500" />
            <span>CalAssist</span>
          </Link>
        )}
        <Button 
          onClick={toggleSidebar} 
          variant="ghost" 
          size="icon" 
          className={cn("ml-auto text-purple-500")}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="p-2">
          <Button className="w-full justify-start gap-2 bg-purple-100 text-purple-800 hover:bg-purple-200 border-0" asChild>
            <Link href="/chat?new=true">
              <Plus size={16} className="text-purple-600" />
              {!collapsed && <span>New Chat</span>}
            </Link>
          </Button>
        </div>
        
        {!collapsed && (
          <div className="px-2 py-2">
            <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">
              Recent conversations
            </div>
            <ScrollArea className="h-[calc(100vh-11.5rem)]">
              <div className="space-y-1">
                {MOCK_CONVERSATIONS.map((conversation) => (
                  <ChatConversationItem 
                    key={conversation.id}
                    conversation={conversation}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
      
      <div className="flex border-t p-2">
        {!collapsed ? (
          <div className="grid w-full grid-cols-3 gap-1">
            <Button variant="ghost" size="icon" className="text-purple-500" asChild>
              <Link href="/dashboard">
                <LayoutGrid size={18} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-purple-500" asChild>
              <Link href="/connect/google-calendar">
                <Calendar size={18} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-purple-500" asChild>
              <Link href="/settings">
                <Settings size={18} />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-2">
            <Button variant="ghost" size="icon" className="text-purple-500" asChild>
              <Link href="/dashboard">
                <LayoutGrid size={18} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-purple-500" asChild>
              <Link href="/connect/google-calendar">
                <Calendar size={18} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-purple-500" asChild>
              <Link href="/settings">
                <Settings size={18} />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 